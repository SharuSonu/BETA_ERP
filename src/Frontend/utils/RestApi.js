import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const createDatabase = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/create-db`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const fetchDatabases = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/companies`);

    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const loginAdmin = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/admin-login`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const loginUser = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/user-login`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      if (status === 401) {
        throw new Error(data.error || 'Unauthorized: Invalid username or password');
      } else if (status === 403) {
        throw new Error(data.message || 'Forbidden: Account is deactivated, please contact admin!');
      } else if (status === 500) {
        throw new Error(data.error || 'Internal Server Error');
      } else {
        throw new Error(data.error || 'An error occurred. Please try again.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from the server. Please try again.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('An error occurred. Please try again.');
    }
  }
};

export const createLedger = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/create-ledger`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const createGroup = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/create-group`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};


export const fetchGroups = async (companyName) => {
  try {
    const response = await axios.get(`${BASE_URL}/groups`, {
      params: { databaseName: companyName } // Pass companyName as a query parameter
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export async function fetchGroupById(groupId, databaseName) {
  try {
    const response = await axios.get(`${BASE_URL}/groups/${groupId}`, {
      params: { databaseName }
    });
    return response.data; 
  } catch (error) {
    console.error('Error fetching group:', error);
    throw error;
  }
}

export const UpdateGroups = async (companyName) => {
  try {
    const response = await axios.get(`${BASE_URL}/update-group`, {
      params: { databaseName: companyName } // Pass companyName as a query parameter
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const createStockGroup = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/create-stockgroup`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    

    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const fetchStockGroups = async (companyName) => {
  try {
    const response = await axios.get(`${BASE_URL}/stockgroups`, {
      params: { databaseName: companyName } // Pass companyName as a query parameter
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const createStockItem = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/create-stockitem`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    

    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const createSalesVoucher = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/create-sales-voucher`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    

    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const fetchSalesVoucher = async (companyName) => {
  try {
    const response = await axios.get(`${BASE_URL}/salesvoucher`, {
      params: { databaseName: companyName }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

//create purchase
export const createPurchaseVoucher = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/create-purchase-voucher`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    

    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};