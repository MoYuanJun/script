import _ from 'lodash';
import React from 'react';
import { Breadcrumb } from 'antd';
import { connect } from "react-redux";

import TableContainer from './TableContainer';
import SearchContainer from './SearchContainer';
import EditFormContainer from './EditFormContainer';
import OperationContainer from './OperationContainer';

import { setPaginationAction } from "../../../modules/paginationModule";
import { setListDataAction } from "../../../modules/listDataModule";

import asyncManage from "./mock/asyncManage";

import './index.less';

const breadcrumbData = ['演示 - 管理'];

class ManagementContainer extends React.Component {
    state = {
        selectedRowKeys: [],        // 表格多选时用于存储勾选项的所有 key 值
    };

    // 设置: this.state.selectedRowKeys
    setSelectedRowKeys = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    // 获取数据: 列表数据
    getData = async (params = {}) => {
        console.log('查询参数: ', params);
        const { current, pageSize } = { ...this.props.pagination, ...params };
        const res = await asyncManage.api_list({ current, pageSize });
        if (res.code !== 200){return false;}
        this.props.setListDataAction(_.get(res, 'data.objects') || []);
        this.props.setPaginationAction({ 
            current, 
            pageSize, 
            total: _.get(res, 'data.total') || 0, 
        });
    };

    componentDidMount(){
        this.getData();
    }

    render (){
        return (
            <div className="content-area">
                <div className="content-header">
                    <Breadcrumb>
                        {breadcrumbData.map(v => (
                            <Breadcrumb.Item key={v}>{v}</Breadcrumb.Item>
                        ))}
                    </Breadcrumb>
                </div>
                <div className="content-body">
                    <SearchContainer 
                        getData={this.getData}
                     />
                    <OperationContainer 
                        getData={this.getData}
                        setSelectedRowKeys={this.setSelectedRowKeys}
                        selectedRowKeys={this.state.selectedRowKeys}
                    />
                    <TableContainer 
                        getData={this.getData}
                        selectedRowKeys={this.state.selectedRowKeys}
                        setSelectedRowKeys={this.setSelectedRowKeys}
                    />
                </div>
                <EditFormContainer getData={this.getData}/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    pagination: state.pagination,
});

const mapDispatchToProps = {
    setListDataAction,
    setPaginationAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(
    ManagementContainer
);
