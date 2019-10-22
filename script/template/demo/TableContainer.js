import _ from 'lodash';
import moment from 'moment';
import React, { Fragment } from 'react';
import { connect } from "react-redux";
import { Table, Popconfirm, Icon, message } from 'antd';

import { openModalAction } from "../../modules/modalModule";
import { setPaginationAction } from "../../../modules/paginationModule";

import asyncManage from "./mock/asyncManage";

const MODAL_CODE = 'MODAL_DEMO_CODE';

class TableContainer extends React.Component {

    // 编辑数据: 打开弹窗
    edit = (record) => {
        this.props.openModalAction({
            data: record,
            title: '修改数据',
            code: MODAL_CODE,
        });
    }

    // 删除单条数据
    delete = async (record) => {
		const res = await asyncManage.api_delete({ ids: [record.id] });
        if (res.code !== 200){return false;}
		message.success('数据删除成功！');
        this.props.setPaginationAction({ current: 1 });
        this.props.getData({ current: 1 });
    }

    render (){
        return (
			<div className="content-table content-block">
				<Table 
					rowKey="id"
					bordered={true}
					pagination={this.pagination}
					rowSelection={this.rowSelection} 
					dataSource={this.props.listData || []}
				>
					<Table.Column title="名称" dataIndex="name"  />
					<Table.Column title="数据类型(数量)" dataIndex="type.length" />
					<Table.Column title="数值" dataIndex="num" />
					<Table.Column title="状态" dataIndex="status" render={this.renderStatus}/>
					<Table.Column title="操作" dataIndex="operation" render={this.opretion} align="center" width="120px"/>
				</Table>
			</div>
        );
    }

    // 渲染状态
    get renderStatus(){
        return (text, record, index) => {
            return (<span>{ text ? '是' : '否' }</span>);
        }
    }

	// 表格操作列
	get opretion(){
		return (text, record, index) => (
			<Fragment>
				<span className="link-edit" onClick={this.edit.bind(null, record)}>
					<Icon type="edit" />
				</span>&nbsp;&nbsp;
                <Popconfirm 
                    okText="是" 
                    cancelText="否" 
                    title="确定删除该记录?" 
                    onConfirm={this.delete.bind(null, record)}>
				    <span className="link-del"><Icon type="delete" /></span>
                </Popconfirm>
			</Fragment>
		);
	}

	// 行选择配置
	get rowSelection(){
		return {
			type: "checkbox",
			onChange: (selectedRowKeys, selectedRows) => {
				this.props.setSelectedRowKeys(selectedRowKeys);
			},
			selectedRowKeys: this.props.selectedRowKeys,
		};
	}

	// 分页器配置
	get pagination(){
		return {
			...this.props.pagination,
			hideOnSinglePage: true,
			onChange: (current, pageSize) => {
				this.props.setPaginationAction({ current, pageSize });
				this.props.getData({ current, pageSize });
			}
		};
	}
}

const mapStateToProps = state => ({
	pagination: state.pagination,
    listData: state.listData,
});

const mapDispatchToProps = {
    setPaginationAction,
    openModalAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(
	TableContainer
);
