import { ColumnHeightOutlined, DeleteOutlined, DownloadOutlined, DownOutlined, EditOutlined, EyeOutlined, FormatPainterOutlined, ReloadOutlined, SwapOutlined, UpOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, message, Modal, Row, Select, Space, Table, theme } from "antd";
import { ColumnsType } from "antd/es/table";
import { TableRowSelection } from "antd/es/table/interface";
import { useState, useEffect } from "react";
import RoleCreate from "../../components/roles/create";
import style from "./role-page.module.scss";
import { RoleDeleteApi, RoleInfo, RoleList, RoleListWithPaginationApi, RoleUpdateApi } from "../../apis/roles/roleApi";

const RolePage: React.FC = () => {
    const [dataSource, setDataSource] = useState<RoleInfo[]>([]);//数据
    const [loading, setLoading] = useState(true);//loading
    const [isModalOpen, setIsModalOpen] = useState(false);//模态框
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectCount, setSelectCount] = useState(0);//选中数量
    const [currentPage, setCurrentPage] = useState(1); // 当前页码
    const [total, setTotal] = useState(0); // 总条目数
    const fetchRoleList = async (pageNumber: number, pageSize: number) => {
        try {
            const response = await RoleListWithPaginationApi(pageNumber, pageSize);
            console.log("response:", response.data);
            setDataSource(response.data.items);
            setTotal(response.data.totalCount); // 设置总条目数
        } catch (error) {
            console.error("获取数据失败:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        fetchRoleList(currentPage, 10);

    }, [currentPage]); // 当前页码变化时重新获取数据

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRowKeys([...selectedRowKeys]);
            setSelectCount(selectedRows.length);
        },
        getCheckboxProps: (record: any) => ({
            disabled: record.name === 'Disabled User', // 列配置不可被选中
            name: record.name,
        }),
    };

    const selectNone = () => {
        setSelectedRowKeys([]);
        setSelectCount(0);
    };

    // 删除角色
    const handleDelete = async (id: string) => {
        const response = await RoleDeleteApi(id);

        if (response.code === 200) {
            fetchRoleList(currentPage, 10); // 删除角色后重新获取数据
            message.success("删除成功");
        } else {
            message.error("删除失败");
        }

    }

    // 编辑角色
    const handleEdit = async (id: string, name: string, order: number, description: string | null) => {
        const response = await RoleUpdateApi({
            id,
            name,
            order,
            description
        }, id)
    }

    const columns: ColumnsType<any> = [
        {
            title: '角色',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '排序',
            dataIndex: 'order',
            key: 'order',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '操作',
            key: 'actions',
            fixed: 'right',
            width: 250,
            render: (record) => (
                <Space>
                    <a><EyeOutlined /> 查看</a>
                    <a><EditOutlined /> 编辑</a>
                    <a style={{ color: "#ed4014" }} onClick={() => handleDelete(record.id)}><DeleteOutlined /> 删除</a>
                    <a> 更多 <DownOutlined style={{ fontSize: "10px" }} /></a>
                </Space>
            ),
        },
    ];



    return (
        <div>

            <Modal
                title="角色添加"
                open={isModalOpen}
                onOk={() => {
                    fetchRoleList(currentPage, 10); // 关闭模态框后重新获取数据
                    setIsModalOpen(false);
                }}
                onCancel={() => {
                    fetchRoleList(currentPage, 10); // 关闭模态框后重新获取数据
                    setIsModalOpen(false);
                }}
                width={"30%"}
                footer={[]}
                destroyOnClose
            >
                <RoleCreate submitOkCallback={() => {
                    fetchRoleList(currentPage, 10); // 创建角色后重新获取数据
                    setIsModalOpen(false);
                }} />
            </Modal>

            <Space className={style.space}>
                <Space align={"center"}>
                    <Button type="primary" onClick={() => setIsModalOpen(true)}>
                        新增
                    </Button>

                    {selectCount > 0 && (
                        <div style={{ border: "1px solid #abdcff", borderRadius: "6px", padding: "0 10px", margin: "-1px", background: "#f0faff" }}>
                            <Space>
                                <div>
                                    已选择 {selectCount} 项
                                </div>

                                <Button type="link" danger>
                                    <DeleteOutlined /> 全部删除
                                </Button>

                                <Button type="link" onClick={selectNone}>
                                    取消选择
                                </Button>
                            </Space>
                        </div>
                    )}
                </Space>

                <Space align={"center"} size={"middle"}>
                    <ReloadOutlined />
                    <DownloadOutlined />
                    <ColumnHeightOutlined />
                    <FormatPainterOutlined />
                    <SwapOutlined />
                </Space>
            </Space>

            <Table
                loading={loading}
                dataSource={dataSource}
                columns={columns}
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                } as TableRowSelection<any>}
                rowKey={(record) => record.id}
                pagination={{
                    showQuickJumper: true,
                    current: currentPage,
                    onChange: (page) => setCurrentPage(page), // 更新当前页码
                    total,
                    showTotal: (total) => `共 ${total} 项`,
                }}
            />
        </div>
    );
};

export default RolePage;