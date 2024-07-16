using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;

namespace DevSolutions.Plugins
{
    public class CustomAutoNumbering : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
            {
                Entity entity = (Entity)context.InputParameters["Target"];
                IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
                IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);

                try
                {

                    if (context.MessageName == "Create")
                    {
                        LockTransaction(service, tracingService);
                        int nextNumber = GetNextAutoNumber(service, tracingService);
                        entity["ds_nonconformitynumber"] = nextNumber.ToString();
                    }
                }
                catch (FaultException<OrganizationServiceFault> ex)
                {
                    throw new InvalidPluginExecutionException("An error occurred in CustomNumberPlugin.", ex);
                }
                catch (Exception ex)
                {
                    tracingService.Trace("CustomAutoNumbering: {0}", ex.ToString());
                    throw;
                }
            }
        }
        private void LockTransaction(IOrganizationService service, ITracingService tracingService)
        {
            var qExpression = new QueryExpression("ds_nonconformitymanagementsetting");
            qExpression.ColumnSet = new ColumnSet("ds_name");
            qExpression.Criteria.AddCondition("ds_name", ConditionOperator.Equal, "Locker For Autonumbering");

            var results = service.RetrieveMultiple(qExpression);

            if (results.Entities.Count == 0)
            {
                Entity newLockRecord = new Entity("ds_nonconformitymanagementsetting");
                newLockRecord["ds_name"] = "Locker For Autonumbering";
                service.Create(newLockRecord);

                // Retrieve the newly created lock record
                results = service.RetrieveMultiple(qExpression);
            }

            var counter = results.Entities.First();
            var blocker = new Entity("ds_nonconformitymanagementsetting") { Id = counter.Id };
            blocker["ds_name"] = "Locker For Autonumbering";

            service.Update(blocker); // Lock all transactions

        }


        private int GetNextAutoNumber(IOrganizationService service, ITracingService tracingService)
        {

            var query = new QueryExpression("ds_nonconformity")
            {
                ColumnSet = new ColumnSet("ds_nonconformitynumber", "ds_nonconformityid")
            };

            query.Criteria.AddCondition("ds_nonconformitynumber", ConditionOperator.NotNull);
            var retrievedRecords = service.RetrieveMultiple(query).Entities;

            List<int> numbers = new List<int>();
            foreach (Entity rec in retrievedRecords)
            {
                string nonconformityNumber = rec.Attributes["ds_nonconformitynumber"].ToString();
                if (nonconformityNumber.All(char.IsDigit))
                {
                    numbers.Add(Convert.ToInt32(nonconformityNumber));
                }
            }

            if (numbers.Count > 0)
            {
                int maxNumber = numbers.Max();
                tracingService.Trace("Max number found: {0}", maxNumber);
                return maxNumber + 1;
            }
            else
            {
                return 1;
            }
        }
    }
}
