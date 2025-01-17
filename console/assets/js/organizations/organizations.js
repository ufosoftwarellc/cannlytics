/**
 * Organizations JavaScript | Cannlytics Console
 * Author: Keegan Skeate
 * Created: 6/9/2021
 * Updated: 6/11/2021
 */
 import { api } from '../api/api.js';
 import { theme } from '../settings/theme.js';
 import { changePhotoURL, storageErrors } from '../firebase.js';
 import { authRequest, hasClass, Password, serializeForm, slugify, showNotification } from '../utils.js';

 
 export const organizations = {

  initialize() {
    /*
     * Initialize the organizations user interface.
     */
    console.log('Initializing organizations!')
    this.getOrganizations('organizations-table');
  },


  changeActiveOrganization(orgId) {
    /*
     * Change the active organization for the user.
     */
    // TODO: Move orgId to beginning of user's list and refresh.
    console.log('Change organizations:', orgId);
  },


  getOrganizations(tableId) {
    /*
     * Get and display a user's organizations.
     */
    // TODO: Specify the columns.
    // address: ""
    // city: ""
    // country: ""
    // email: ""
    // external_id: ""
    // linkedin: ""
    // name: "Cannlytics"
    // owner: "v86tNoemQzgrnMvlWq6mxCASg523"
    // phone: ""
    // public: "false"
    // state: ""
    // team: ["v86tNoemQzgrnMvlWq6mxCASg523"]
    // trade_name: ""
    // uid: "cannlytics"
    // website: ""
    // zip_code: ""
    const columnDefs = [
      { field: 'name', sortable: true, filter: true },
      { field: 'email', sortable: true, filter: true },
      { field: 'phone', sortable: true, filter: true }
    ];

    // Specify the table options.
    const gridOptions = {
      columnDefs: columnDefs,
      pagination: true,
      rowSelection: 'multiple',
      suppressRowClickSelection: false,
      // singleClickEdit: true,
      // onRowClicked: event => console.log('A row was clicked'),
      onGridReady: event => theme.toggleTheme(theme.getTheme()),
    };

    // Get the data and render the table.
    api.getOrganizations().then((data) => {
      console.log('Table data:', data); // DEV:
      const eGridDiv = document.querySelector(`#${tableId}`);
      new agGrid.Grid(eGridDiv, gridOptions);
      gridOptions.api.setRowData(data);
    })
    .catch((error) => {
      console.log('Error:', error);
    });

    // TODO: Attach export functionality
    //function exportTableData() {
    //  gridOptions.api.exportDataAsCsv();
    //}
  },


  updateOrganization() {
    /*
     * 
     */
  },


  createOrganization() {
    /*
     * 
     */
  },


  deleteOrganization() {
    /*
     * 
     */
  },


  joinOrganizationRequest() {
    /*
     * Send the owner of an organization a request for a user to join.
     */
    const organization = document.getElementById('join-organization-input').value;
    if (!organization) {
      showNotification('Organization required', 'Enter an organization name.', { type: 'error' });
      return;
    }
    authRequest('/api/organizations/join', { organization, join: true }).then((response) => {
      if (response.success) {
        showNotification('Organization request sent', response.message, { type: 'success' });
      } else {
        showNotification('Organization request failed', response.message, { type: 'error' });
      }
    });
  },


  saveOrganization(orgType) {
    /*
     * Save's a user's organization choice.
     */
    // FIXME:
    const elements = document.getElementById('create-organization-form').elements;
    const data = {};
    for (let i = 0 ; i < elements.length ; i++) {
      const item = elements.item(i);
      if (item.name) data[item.name] = item.value;
    }
    const orgId = slugify(data['name'])
    console.log('Org ID:', orgId);
    console.log('Data to upload:', data);
    authRequest(`/api/organizations`, data).then((response) => {
      console.log('Saved org:', response);
      // TODO: Show better error messages.
      // TODO: Tell user if organization name is already taken
      if (response.error) {
        showNotification('Organization request failed', response.message, { type: 'error' });
      } else {
        // showNotification('Organization request sent', response.message, { type: 'success' });
        document.location.href = `/get-started/support/?from=${orgType}`;
      }
    });
  },

  uploadOrgPhoto(orgId) {
    /*
     * Upload a photo for an organization through the API.
     */
    if (this.files.length) {
  
      // Show a notification.
      showNotification('Uploading photo', 'Uploading your organization picture...', { type: 'wait' });
      
      // Fill the photo into the UI.
      changePhotoURL(this.files[0]).then((downloadURL) => {
        authRequest('/api/organizations', { photo_url: downloadURL, uid: orgId });
        document.getElementById('org-photo-url').src = downloadURL;
        showNotification('Uploading photo complete', 'Successfully uploaded organization picture.', { type: 'success' });
      }).catch((error) => {
        showNotification('Photo Change Error', storageErrors[error.code], { type: 'error' });
      });
    }
  },


}


/*
 * UI Management
 */

function initializeGetStartedOrganizationUI(data) {
  /*
   * Initialize the get-started organization section.
   */

  // Populate form.
  // const { elements } = document.querySelector('form')
  // for (const [ key, value ] of Object.entries(data)) {
  //   const field = elements.namedItem(key)
  //   try {
  //     field && (field.value = value);
  //   } catch(error) {}
  // }

  // Attach functionality.
  const fileElem = document.getElementById('selectPhotoUrl');
  fileElem.addEventListener('change', uploadOrgPhoto, false);

}
