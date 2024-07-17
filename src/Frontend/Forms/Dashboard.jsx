import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Dropdown, Menu } from 'antd';
import { RiArrowDownSLine } from 'react-icons/ri';
import { AppContext } from '../../Context/AppContext';

const Dashboard = () => {
    const { companyName } = useContext(AppContext);
    return (
        <div className="container-fluid">
            <Row gutter={24}>
                {/* Left Column */}
                <Col lg={4}>
                    <Card className="card-transparent card-block card-stretch card-height border-none">
                        <div className="card-body p-0 mt-lg-2 mt-0">
                            <h3 className="mb-3">Hi {companyName},</h3>
                            <p className="mb-0 mr-4">Your dashboard gives you views of key performance or business process.</p>
                        </div>
                    </Card>
                </Col>

                {/* Right Column (Main Dashboard) */}
                <Col lg={20}>
                    <Row gutter={24}>
                        {/* First Row */}
                        <Col lg={8} md={8}>
                            <Card className="card card-block card-stretch card-height">
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-4 card-total-sale">
                                        <div className="icon iq-icon-box-2 bg-info-light">
                                            <img src="../../assets/images/product/1.png" className="img-fluid" alt="image" />
                                        </div>
                                        <div>
                                            <p className="mb-2">Total Sales</p>
                                            <h4>31.50</h4>
                                        </div>
                                    </div>
                                    <div className="iq-progress-bar mt-2">
                                        <span className="bg-info iq-progress progress-1" data-percent="85"></span>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        {/* Second Row */}
                        <Col lg={8} md={8}>
                            <Card className="card card-block card-stretch card-height">
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-4 card-total-sale">
                                        <div className="icon iq-icon-box-2 bg-danger-light">
                                            <img src="../../assets/images/product/2.png" className="img-fluid" alt="image" />
                                        </div>
                                        <div>
                                            <p className="mb-2">Total Cost</p>
                                            <h4>$ 4598</h4>
                                        </div>
                                    </div>
                                    <div className="iq-progress-bar mt-2">
                                        <span className="bg-danger iq-progress progress-1" data-percent="70"></span>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        {/* Third Row */}
                        <Col lg={8} md={8}>
                            <Card className="card card-block card-stretch card-height">
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-4 card-total-sale">
                                        <div className="icon iq-icon-box-2 bg-success-light">
                                            <img src="../assets/images/product/3.png" className="img-fluid" alt="image" />
                                        </div>
                                        <div>
                                            <p className="mb-2">Product Sold</p>
                                            <h4>4589 M</h4>
                                        </div>
                                    </div>
                                    <div className="iq-progress-bar mt-2">
                                        <span className="bg-success iq-progress progress-1" data-percent="75"></span>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    {/* Large Right Column Cards */}
                    <Row gutter={24}>
                        {/* First Large Card */}
                        <Col lg={12}>
                            <Card className="card card-block card-stretch card-height">
                                <div className="card-header d-flex justify-content-between">
                                    <div className="header-title">
                                        <h4 className="card-title">Overview</h4>
                                    </div>                        
                                    <div className="card-header-toolbar d-flex align-items-center">
                                        <Dropdown overlay={dropdownMenu} trigger={['click']}>
                                            <span className="dropdown-toggle dropdown-bg btn">
                                                This Month <RiArrowDownSLine className="ml-1" />
                                            </span>
                                        </Dropdown>
                                    </div>
                                </div> 
                                <div className="card-body">
                                    <div id="layout1-chart1"></div>
                                </div>
                            </Card>
                        </Col>
                        {/* Second Large Card */}
                        <Col lg={12}>
                            <Card className="card card-block card-stretch card-height">
                                <div className="card-header d-flex align-items-center justify-content-between">
                                    <div className="header-title">
                                        <h4 className="card-title">Revenue Vs Cost</h4>
                                    </div>
                                    <div className="card-header-toolbar d-flex align-items-center">
                                        <Dropdown overlay={dropdownMenu} trigger={['click']}>
                                            <span className="dropdown-toggle dropdown-bg btn">
                                                This Month <RiArrowDownSLine className="ml-1" />
                                            </span>
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div id="layout1-chart-2" style={{ minHeight: '360px' }}></div>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    {/* Remaining Columns */}
                    <Row gutter={24}>
                        {/* Top Products */}
                        <Col lg={16}>
                            <Card className="card card-block card-stretch card-height">
                                <div className="card-header d-flex align-items-center justify-content-between">
                                    <div className="header-title">
                                        <h4 className="card-title">Top Products</h4>
                                    </div>
                                    <div className="card-header-toolbar d-flex align-items-center">
                                        <Dropdown overlay={dropdownMenu} trigger={['click']}>
                                            <span className="dropdown-toggle dropdown-bg btn">
                                                This Month <RiArrowDownSLine className="ml-1" />
                                            </span>
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <Row gutter={24} className="top-product">
                                        {/* Product Items */}
                                        <Col lg={6}>
                                            <Card className="card card-block card-stretch card-height mb-0">
                                                <div className="card-body">
                                                    <div className="bg-warning-light rounded">
                                                        <img src="../assets/images/product/01.png" className="style-img img-fluid m-auto p-3" alt="image" />
                                                    </div>
                                                    <div className="style-text text-left mt-3">
                                                        <h5 className="mb-1">Organic Cream</h5>
                                                        <p className="mb-0">789 Item</p>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Col>
                                        {/* Add more product items here */}
                                    </Row>
                                </div>
                            </Card>
                        </Col>

                        {/* Remaining Cards */}
                        <Col lg={8}>
                            {/* Best Item All Time */}
                            <Card className="card card-transparent card-block card-stretch mb-4">
                                <div className="card-header d-flex align-items-center justify-content-between p-0">
                                    <div className="header-title">
                                        <h4 className="card-title mb-0">Best Item All Time</h4>
                                    </div>
                                    <div className="card-header-toolbar d-flex align-items-center">
                                        <a href="#" className="btn btn-primary view-btn font-size-14">View All</a>
                                    </div>
                                </div>
                            </Card>
                            {/* Add more small cards here */}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

// Dropdown menu for the components
const dropdownMenu = (
    <Menu>
        <Menu.Item key="1">Yearly</Menu.Item>
        <Menu.Item key="2">Monthly</Menu.Item>
        <Menu.Item key="3">Weekly</Menu.Item>
    </Menu>
);

export default Dashboard;
