import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { AppContext } from '../../../Context/AppContext';
import { createGroup, fetchStockGroups } from '../../utils/RestApi';
import { Input, Table, Button, message, Pagination, Spin, Alert, Modal, Divider, Checkbox, Row, Col, Form, Select } from 'antd';
import '../../../styles/StockGroupList.css';

//import dotenv from 'dotenv';
//dotenv.config();


const StockGroupList = ({ onSelectStockGroup }) => {
  const { companyName } = useContext(AppContext);
  const [StockGroups, setStockGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [StockGroupOptions, setStockGroupOptions] = useState([]);
  
  const defaultGroups =[
    'Primary'
  ];
  // State for column visibility
  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    name: true,
    parentGroup: true,
    action: true,
  });

  const [editStockGroupId, setEditStockGroupId] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [stockgroupName, setStockGroupName] = useState('');
  const [parentGroup, setParentGroup] = useState('');
  const [stockgroupalias, setstockgroupAlias] = useState('');


  useEffect(() => {
    const fetchStockGroups = async () => {
      setLoading(true);

      try {
        const response = await axios.get('http://localhost:5000/api/stockgroupslist', {
          params: {
            companyName: companyName,
            page: currentPage,
            limit: pageSize,
          }
        });

        setStockGroups(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchStockGroups();
  }, [companyName, currentPage, pageSize]);

  useEffect(() => {
    const fetchStockGroupsFromDatabase = async () => {
      console.log("Fetching stock groups for company:", companyName);
      try {
        const response = await fetchStockGroups(companyName);
        console.log("API response:", response);
        if (response.success) {
          const databaseGroups = response.groups || [];
          const combinedGroups = [...defaultGroups, ...databaseGroups];
          const uniqueGroups = Array.from(new Set(combinedGroups));
          console.log("Combined and unique groups:", uniqueGroups);
          setStockGroupOptions(uniqueGroups);
        } else {
          console.error('Failed to fetch groups:', response.message);
        }
      } catch (error) {
        console.error('Error fetching groups from database:', error);
      }
    };

    if (companyName) {
      fetchStockGroupsFromDatabase();
    } else {
      console.log("No company name found, setting default groups:", defaultGroups);
      setStockGroupOptions(defaultGroups);
    }
  }, [companyName]);

  useEffect(() => {
    const fetchGroupsFromDatabase = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/stockgroups_edit/${editStockGroupId}`, {
          params: {
            companyName: companyName,
          }
        });
        console.log('Response from API:', response.data); 
        if (response.data) {
          const { name, parentGroup, group_alias } = response.data;
          setStockGroupName(name);
          setParentGroup(parentGroup);
          setstockgroupAlias(group_alias);
          setEditModalVisible(true);
        } else {
          console.error('Failed to fetch stock group details:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching stock group details from database:', error);
      }
    };
  
    if (editStockGroupId) {
      fetchGroupsFromDatabase();
    }
  }, [editStockGroupId]);

  const handleStockGroupNameChange = (value) => {
    setStockGroupName(value);
  };

  const handleParentGroupChange = (value) => {
    setParentGroup(value);
  };

 const handleStockGroupAliasNameChange = (value) =>{
  setstockgroupAlias(value);
 } 

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleCheckboxChange = (e) => {
    setColumnVisibility({ ...columnVisibility, [e.target.name]: e.target.checked });
  };

  const filteredStockGroups = StockGroups.filter(StockGroup =>
    (StockGroup.name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (StockGroup.parentStockGroup?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
  );

  const indexOfLastStockGroup = currentPage * pageSize;
  const indexOfFirstStockGroup = indexOfLastStockGroup - pageSize;
  const currentStockGroups = filteredStockGroups.slice(indexOfFirstStockGroup, indexOfLastStockGroup);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', visible: columnVisibility.id },
    { title: 'Group', dataIndex: 'name', key: 'name', visible: columnVisibility.name },
    { title: 'SubGroup', dataIndex: 'parentGroup', key: 'parentGroup', visible: columnVisibility.parentGroup },
    {
      title: 'Action',
      key: 'action',
      visible: columnVisibility.action,
      render: (_, record) => (
        <div className="btn-StockGroup" role="StockGroup" aria-label="Actions">
          <Button
            type="default"
            className="edit-button"
            onClick={() => openEditModal(record.id)}
          >
            Edit
          </Button>
          <Button
            type="default"
            className="delete-button mr-2"
            onClick={() => confirmDelete(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ].filter(column => column.visible); // Filter out columns based on visibility

  const openEditModal = (StockGroupId) => {
    const group = StockGroups.find(group => group.id === StockGroupId);
    if (group) {
      setEditStockGroupId(StockGroupId);
      setStockGroupName(group.name);
      setParentGroup(group.parentGroup);
      setEditModalVisible(true);
    }
  };

  const closeEditModal = () => {
    setEditStockGroupId(null);
    setEditModalVisible(false);
    // Clear form fields on modal close if needed
    setStockGroupName('');
    setParentGroup('');
  };

  const confirmDelete = (StockGroupId) => {
    Modal.confirm({
      title: 'Are you sure delete this StockGroup?',
      content: 'This action cannot be undone.',
      onOk() {
        console.log(`Delete StockGroup with ID: ${StockGroupId}`);
      }
    });
  };

   //Modal Submit
   const handleSubmitEdit = async() => {
    try {
      
      const response = await axios.put(`http://localhost:5000/api/update-stockgroup`, {
        name: stockgroupName,       // Assuming groupName, groupAlias, and parentGroup are defined states
        group_alias: stockgroupalias,
        parentGroup: parentGroup,
        id : editStockGroupId,
        databaseName:companyName
      });
  
      if (response.data.success) {
        message.success('Group Updated successfully!');
        console.log('Group updated successfully');
        refreshStockGroupList();
        closeEditModal();
      } else {
        console.error('Failed to update Stock group:', response.data.message);
        // Handle error condition as needed
      }
    } catch (error) {
      console.error('Error updating stock group:', error);
      // Handle network error or other exceptions
    }
  };

  const refreshStockGroupList = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stockgroupslist', {
          params: {
            companyName: companyName,
            page: currentPage,
            limit: pageSize,
          }
        });

        setStockGroups(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

  if (loading) return <Spin tip="Loading..." />;
  if (error) return <Alert message="Error" description={error.message} type="error" showIcon />;

  const pageSizeOptions = ['5', '10', '20', '50'];

  return (
    <div className="StockGroup-list">
      <h2>StockGroup List</h2>

      <Input.Search
        className="mb-3"
        placeholder="Search StockGroup name, parent StockGroup..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Row gutter={[16, 16]}>
        {Object.keys(columnVisibility).map((key) => (
          <Col key={key}>
            <Checkbox
              name={key}
              checked={columnVisibility[key]}
              onChange={handleCheckboxChange}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Checkbox>
          </Col>
        ))}
      </Row>

      <Divider />

      <Table
        dataSource={currentStockGroups}
        columns={columns}
        pagination={false}
      />

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={filteredStockGroups.length}
        onChange={handlePageChange}
        onShowSizeChange={handlePageSizeChange}
        pageSizeOptions={pageSizeOptions}
        showSizeChanger
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
        style={{ marginTop: 20, textAlign: 'right' }}
      />
      <Modal
        title={`Edit Stock Group ID: ${editStockGroupId}`}
        visible={editModalVisible}
        onCancel={closeEditModal}
        footer={[
          <Button key="cancel" onClick={closeEditModal}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={handleSubmitEdit}>Update</Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="StockGroup Name">
            <Input value={stockgroupName} onChange={(e) => handleStockGroupNameChange(e.target.value)} />
          </Form.Item>
          <Form.Item label="Alias">
            <Input name= "stockgroupalias" value={stockgroupalias} onChange={(e) => handleStockGroupAliasNameChange(e.target.value)}/>
          </Form.Item>
          <Form.Item label="Parent Group">
            <Select showSearch optionFilterProp="children" value={parentGroup} onChange={(value) => handleParentGroupChange(value)}>
              {StockGroupOptions.map(group => (
                <Option key={group} value={group}>{group}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Divider />
    </div>
  );
};

StockGroupList.propTypes = {
  onSelectStockGroup: PropTypes.func
};

export default StockGroupList;
