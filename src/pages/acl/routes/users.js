import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Card, Divider, Button, Input, Form, Modal } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';

const { Search } = Input;
const { confirm } = Modal;

@connect(({ acl, loading }) => ({
  acl,
  loading: loading.effects['acl/queryUsers'],
}))
@Form.create()
class UserList extends PureComponent {
  state = {
    pageSize: 10,
    curRowIndex: -1,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageSize } = this.state;
    dispatch({
      type: 'acl/queryUsers',
      payload: { page: 1, rows: pageSize },
    });
    dispatch({
      type: 'acl/queryRoles',
      payload: {},
    });
  }

  componentWillUnmount() {}

  handleStandardTableChange = pagination => {
    console.log('pagination', pagination);
    const { dispatch } = this.props;
    const { keyword } = this.state;

    this.setState({ pageSize: pagination.pageSize });
    const payload = { rows: pagination.pageSize, page: pagination.current };
    if (keyword) payload.keyword = keyword;
    dispatch({
      type: 'acl/queryUsers',
      payload,
    });
  };

  handleRow = (record, index) => ({
    onMouseEnter: () => {
      this.setState({ curRowIndex: index });
    }, // 鼠标移入行
    onMouseLeave: () => {
      this.setState({ curRowIndex: -1 });
    }, // 鼠标移出行
  });

  handleDetail = record => {
    const { match } = this.props;
    router.push({
      pathname: `${match.url}/info`,
      search: `?id=${record.id}`,
    });
  };

  handleAdd = () => {
    const { match } = this.props;
    router.push(`${match.url}/create`);
  };

  handleSearch = value => {
    const { dispatch } = this.props;
    const { pageSize } = this.state;
    const payload = { page: 1, rows: pageSize };
    if (value) payload.keyword = value;
    dispatch({
      type: 'acl/queryUsers',
      payload,
    });
    this.setState({ keyword: value });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    confirm({
      title: '提示',
      content: '确定要删除此用户?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'acl/removeAclUser',
          payload: { id },
          callback: () => {},
        });
      },
      onCancel() {},
    });
  };

  render() {
    const { acl: model, loading } = this.props;
    const { pageSize, curRowIndex } = this.state;
    const { userList: data, roles } = model;
    const rows = data.rows || [];
    const listData = {
      list: rows,
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: Number(data.page),
        total: Number(data.total),
        showTotal(total) {
          return `共${total}条`;
        },
        pageSize,
      },
    };
    const columns = [
      {
        title: '用户ID',
        dataIndex: 'id',
        width: '10%',
        key: 'id',
        render: text => {
          text = text || '';
          return text;
        },
      },
      {
        title: '昵称',
        dataIndex: 'nick',
        width: '12%',
        key: 'nick',
        render: text => {
          if (text && text.length > 30) {
            text = text.slice(0, 30);
            text += '...';
          }
          return (
            <Fragment>
              <span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>
            </Fragment>
          );
        },
      },
      {
        title: '角色',
        dataIndex: 'roles',
        width: '10%',
        key: 'roles',
        render: text => {
          const rolesAry = [];
          text = text || [];
          text.forEach(id => {
            roles.forEach(item => {
              if (item.id === id) {
                if (item.title) {
                  rolesAry.push(item.title);
                } else {
                  rolesAry.push(item);
                }
              }
            });
          });
          text = rolesAry.join(',');
          return (
            <Fragment>
              <span>{text}</span>
            </Fragment>
          );
        },
      },
      {
        title: '标签',
        dataIndex: 'tags',
        width: '10%',
        key: 'tags',
        render: text => {
          text = (text || []).join(',');
          return (
            <Fragment>
              <span>{text}</span>
            </Fragment>
          );
        },
      },
      {
        title: '创建者',
        dataIndex: 'creator',
        width: '10%',
        key: 'creator',
        render: (text = {}) => {
          text = text.nick;
          return (
            <Fragment>
              <span>{text}</span>
            </Fragment>
          );
        },
      },
      {
        title: '激活状态',
        dataIndex: 'status',
        width: '10%',
        key: 'status',
        render: text => {
          text = text === 1 ? '正常' : '封停';
          return (
            <Fragment>
              <span>{text}</span>
            </Fragment>
          );
        },
      },
      {
        title: '创建时间',
        dataIndex: 'crtime',
        width: '13%',
        key: 'crtime',
        render: text => (
          <Fragment>
            <span>{moment(text).format('YYYY-MM-DD HH:mm')}</span>
          </Fragment>
        ),
      },
      {
        title: '操作',
        width: '15%',
        render: (text, record, index) => (
          <Fragment>
            <a onClick={() => this.handleDetail(record)}>详情</a>
            {curRowIndex === index && (
              <span>
                <Divider type="vertical" />
                <a onClick={() => this.handleDelete(record.id)}>删除</a>
              </span>
            )}
          </Fragment>
        ),
      },
    ];

    const extraContent = (
      <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
        分配角色
      </Button>
    );

    return (
      <PageHeaderWrapper title="用户管理">
        <Card
          bordered={false}
          title={
            <Search
              style={{ width: '300px' }}
              placeholder="请输入账号或昵称关键字, 按Enter搜索"
              onSearch={value => this.handleSearch(value)}
            />
          }
          extra={extraContent}
        >
          <div className={styles.tableList}>
            <Table
              rowKey="id"
              loading={loading}
              dataSource={listData.list}
              columns={columns}
              pagination={listData.pagination}
              onChange={this.handleStandardTableChange}
              onRow={this.handleRow}
              locale={{ emptyText: '暂无用户' }}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default UserList;
