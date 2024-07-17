# NETWORG Engineering Team Assessment Solution

## Overview

This solution is designed to help ConstructSafe Inc. manage non-conformities in construction projects. It allows users to report issues, assign corrective actions, and notify responsible managers. This solution includes entities, cloud flows, plugins, security roles, web resources, and a canvas application.

## Entities

### 1. Non-Conformity
- **Purpose**: To report and manage different types of non-conformities.

### 2. Corrective Action
- **Purpose**: To create and manage corrective actions related to non-conformities.

### 3. Evidence
- **Purpose**: To attach and manage evidence files related to non-conformities.

### 4. Non-Conformity Management Setting
- **Purpose**: Used for the autonumbering plugin.

## Cloud Flows (Power Automate)

### 1. Create Non-Conformity Record
- **Description**: An HTTP-triggered flow that creates a new Non-Conformity record.
- **Trigger**: HTTP request.
- **Actions**: Create a Non-Conformity record in Dataverse.

### 2. Notify the Manager of Non-Conformity Creation/Update
- **Description**: Sends an email notification to the assigned manager when a Non-Conformity record is created or updated.
- **Trigger**: Creation or update of a Non-Conformity record.
- **Actions**: Send an email via Outlook.

### 3. Weekly Report Summary for Non-Conformity
- **Description**: Generates a PDF summary of non-conformities created in the last seven days and stores the file in OneDrive.
- **Trigger**: Recurrence (weekly).
- **Actions**: Generate PDF summary, and store it in OneDrive.

## Plugins

### DevSolutions.Plugins.CustomAutoNumbering
- **Description**: Generates a unique number for each Non-Conformity record upon creation.
- **Trigger**: Pre-Operation (Create).
- **Entity**: Non-Conformity.

## Security Role

### Non-Conformity Management Role
- **Description**: Provides necessary permissions for all entities in the solution.
- **Entities**: Non-Conformity, Corrective Action, Evidence, Non-Conformity Management Setting.

## Web Resources

### 1. Non-Conformity Change Ribbon Behavior
- **Description**: Custom action to open a confirmation window when a record is clicked.
- **Usage**: Overrides the default open behaviour of records in the grid.

### 2. Non-Conformity Form
- **Description**: Contains logic for conditional displaying of form attributes based on the type field and custom logic for the business process flow next stage button.
- **Usage**: Enhances the form behaviour and user experience.

## Canvas Application

### Corrective Actions App
- **Description**: Allows users to add Corrective Actions to their assigned non-conformities and upload related files.
- **Features**:
  - Add new corrective actions.
  - View all non-conformities related to the current user.
  - Upload evidence files.

## Installation and Configuration

1. **Import the Solution**:
   - Go to Power Apps, navigate to `Solutions`, and import the solution file.

2. **Assign Security Roles**:
   - Assign the "Non-Conformity Management Role" to relevant users to ensure they have access to the necessary entities and functionalities.

3. **Configure Web Resources**:
   - Ensure the JavaScript web resources are correctly linked to the forms and ribbon actions.

4. **Set Up Cloud Flows**:
   - Ensure the Power Automate flows are activated and properly configured with the necessary connections (e.g., OneDrive, Outlook).

5. **Deploy Canvas App**:
   - Publish the Corrective Actions App and share it with relevant users.
