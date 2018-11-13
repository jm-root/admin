import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Icon,
  Button,
  Dropdown,
  Menu,
  Modal,
  message,
} from 'antd'
import StandardTable from '@/components/StandardTable'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'

import styles from './index.less'

const FormItem = Form.Item
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',')

const CreateForm = Form.create()(props => {
  const {modalVisible, form, handleAdd, handleModalVisible} = props
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return
      form.resetFields()
      handleAdd(fieldsValue)
    })
  }
  return (
    <Modal
      destroyOnClose
      title="新建敏感词"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="敏感词">
        {form.getFieldDecorator('word', {
          rules: [{required: true}],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  )
})

/* eslint react/no-multi-comp:0 */
@connect(({wordfilter, rule, loading}) => ({
  rule,
  wordfilter,
  loading: loading.models.rule,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
  }

  columns = [
    {
      title: '序号',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '标识ID',
      dataIndex: '_id',
    },
    {
      title: '敏感词',
      dataIndex: 'word',
      sorter: true,
    },
    {
      title: '添加时间',
      dataIndex: 'crtime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
  ]

  componentDidMount () {
    const {dispatch} = this.props
    dispatch({
      type: 'wordfilter/list',
    })
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props
    const {formValues} = this.state

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj}
      newObj[key] = getValue(filtersArg[key])
      return newObj
    }, {})

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    }
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`
    }

    dispatch({
      type: 'wordfilter/list',
      payload: params,
    })
  }

  handleFormReset = () => {
    const {form, dispatch} = this.props
    form.resetFields()
    this.setState({
      formValues: {},
    })
    dispatch({
      type: 'wordfilter/list',
      payload: {},
    })
  }

  handleMenuClick = e => {
    const {dispatch} = this.props
    const {selectedRows} = this.state

    if (!selectedRows) return
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'wordfilter/remove',
          payload: selectedRows.map(row => row._id),
          callback: () => {
            this.setState({
              selectedRows: [],
            })
          },
        })
        break
      default:
        break
    }
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    })
  }

  handleSearch = e => {
    e.preventDefault()

    const {dispatch, form} = this.props

    form.validateFields((err, fieldsValue) => {
      if (err) return

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      }

      this.setState({
        formValues: values,
      })

      dispatch({
        type: 'wordfilter/list',
        payload: values,
      })
    })
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    })
  }

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    })
  }

  handleAdd = fields => {
    const {dispatch} = this.props
    dispatch({
      type: 'wordfilter/add',
      payload: fields,
    })

    message.success('添加成功')
    this.handleModalVisible()
  }

  renderSimpleForm () {
    const {
      form: {getFieldDecorator},
    } = this.props
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="敏感词">
              {getFieldDecorator('search')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    )
  }

  renderForm () {
    return this.renderSimpleForm()
  }

  render () {
    const {
      wordfilter: {data},
      loading,
    } = this.props
    const {selectedRows, modalVisible, updateModalVisible, stepFormValues} = this.state
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    )

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    }
    return (
      <PageHeaderWrapper title="敏感词列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              rowKey="_id"
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    )
  }
}

export default TableList
