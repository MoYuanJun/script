import _ from 'lodash';
import React from 'react';
import { connect } from "react-redux";
import { Breadcrumb, Button, Modal, message } from 'antd';

import { openModalAction } from "../../modules/modalModule";
import { setPaginationAction } from "../../../modules/paginationModule";

import asyncManage from "./mock/asyncManage";

const MODAL_CODE = 'MODAL_DEMO_CODE';

class OperationContainer extends React.Component {

    // 添加数据: 打开弹窗并设置标题
    add = () => {
        this.props.openModalAction({
            code: MODAL_CODE,
            title: '添加数据'
        });
    }

    // 删除多条数据
    delete = () => {
        const { selectedRowKeys, getData } = this.props;
        if (selectedRowKeys.length < 1){
            message.warning('请先选择数据!');
            return false;
        }
        Modal.confirm({
            okText: '是',
            cancelText: '否',
            title: '确定批量删除记录?',
            onOk: async () => {
                const res = await asyncManage.api_delete({ ids: [ ...selectedRowKeys ] });
                if (res.code !== 200){return false;}
                message.success('数据删除成功！');
                this.props.setSelectedRowKeys([]);
                this.props.setPaginationAction({ current: 1 });
                this.props.getData({ current: 1 });
            },
        });
    }

    render (){
        return (
            <div className="content-operation">
                <Button icon="plus" onClick={this.add}>添加</Button> 
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button icon="delete" onClick={this.delete}>删除</Button>
            </div>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
    openModalAction,
    setPaginationAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(
    OperationContainer
);
