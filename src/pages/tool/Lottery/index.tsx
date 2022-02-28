import React, { useEffect, useState, useCallback } from "react";
import Layout from '@theme/Layout';
import { Input, Button, Row, Col, Card, Form, InputNumber, Space, List, Tag, message, Select, Popconfirm } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { LuckyWheel } from '@lucky-canvas/react'
import lotteryFn from './lottery_fn'
import { useLocalStorage } from "react-use";
import { ModalForm, ProFormText } from "@ant-design/pro-form";

const defaultFormValues = {
    items: [
        {
            name: '饺子',
            weight: 1
        }
    ]
}

export default function Lottery() {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState<boolean>(false)
    const [wins, setWins] = useState<{ time: Date, name: string }[]>([])
    const myLucky = React.useRef<{ play: () => void, stop: (index: number) => void }>()
    useEffect(() => {
        form.setFieldsValue(defaultFormValues)
    }, [])
    const [lotteryList, setLotteryList] = useLocalStorage<{ [index: string]: { name: string, weight: number }[] }>('lottery_list', {}, {
        raw: false,
        serializer: JSON.stringify,
        deserializer: JSON.parse,
    })

    // 已选择
    const [selectedLottery, setSelectedLottery] = useState<string>('')
    // 已加载
    const [loadedLotteryKey, setLoadedLotteryKey] = useState<string>('')

    const winCallback = useCallback((prize) => {
        const currentWins = [{ name: prize.fonts[0].text, time: new Date() }, ...wins];

        console.log('prev wins', wins);
        console.log('curr wins', currentWins);
        console.log('prize', prize);
        
        setWins(currentWins)
        setLoading(false)
    }, [wins])

    const [lotteryConfig, setLotteryConfig] = React.useState<any>(
        {
            blocks: [{ padding: '13px', background: '#617df2' }],
            prizes: [
            ],
            buttons: [
                { radius: '50px', background: '#617df2' },
                { radius: '45px', background: '#afc8ff' },
                {
                    radius: '40px', background: '#869cfa',
                    pointer: true,
                    fonts: [{ text: '开始\n抽奖', top: '-20px' }]
                },
            ],
        }
    )

    const updateLickyWheel = (values) => {
        console.log(values)
        if (values.items.length <= 1) {
            message.warning('至少得有 2 个抽奖项')
            return
        }
        setLotteryConfig({
            ...lotteryConfig,
            prizes: values.items.map((item, index) => {
                return { fonts: [{ text: item.name, top: '10%' }], background: '#e9e8fe' }
            })
        })
    }

    const win = () => {

    }

    return (<>
        <Layout>
            {/* <center>今天吃什么</center> */}
            <Row>
                <Col span={12}>
                    <Space>
                        <Select
                            style={{ width: '200px' }}
                            options={Object.keys(lotteryList).map(lottery => ({ label: lottery, value: lottery }))}
                            onChange={(value) => setSelectedLottery(value)}
                        ></Select>
                        <Button type="primary" onClick={() => {
                            const l = lotteryList[selectedLottery]
                            if (!l) {
                                message.info(`${selectedLottery} 不存在`)
                                return
                            }
                            form.setFieldsValue({
                                items: l
                            })
                            setLotteryConfig({
                                ...lotteryConfig,
                                prizes: l.map((item, index) => {
                                    return { fonts: [{ text: item.name, top: '10%'}], background: '#e9e8fe' }
                                })
                            })
                            message.success(`${selectedLottery} 已加载`)
                            setLoadedLotteryKey(selectedLottery)
                        }}>加载</Button>
                    </Space>
                    <Form form={form} onFinish={updateLickyWheel} style={{ marginTop: '1rem' }}>
                        <Form.List name='items'>
                            {
                                (fields, { add, remove }, { errors }) => (
                                    <>
                                        {
                                            fields.map((field, index) => {
                                                return <>
                                                    <Row>
                                                        <Col span={8}>
                                                            <Form.Item rules={[{ required: true, message: '抽奖项不能为空' }]}  {...field} name={[field.name, 'name']} label='抽奖项'>
                                                                <Input />
                                                            </Form.Item>

                                                        </Col>
                                                        <Col span={8}>
                                                            <Form.Item {...field} name={[field.name, 'weight']} label='抽奖权重'>
                                                                <InputNumber min={0.1} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={4}>
                                                            <Space>
                                                                <Button icon={<MinusCircleOutlined />} onClick={() => remove(field.name)} type={'primary'} />
                                                                {
                                                                    index === fields.length - 1 ?
                                                                        <Button onClick={() => add({ name: '', weight: 1 })} icon={<PlusCircleOutlined />} type={'primary'} ></Button>
                                                                        : null
                                                                }
                                                            </Space>
                                                        </Col>
                                                    </Row>
                                                </>

                                            })
                                        }
                                    </>
                                )
                            }
                        </Form.List>
                        <Form.Item wrapperCol={{ offset: 2, span: 16 }}>
                            <Space>
                                <Button type="primary" htmlType="submit" disabled={loading} >
                                    更新转盘
                                </Button>
                                <Button disabled={loadedLotteryKey === ''} type="primary" onClick={() => {
                                    setLotteryList({
                                        ...lotteryList,
                                        [loadedLotteryKey]: form.getFieldsValue().items
                                    })
                                    message.success(`${selectedLottery} 保存成功`)
                                }}>
                                    保存
                                </Button>
                                <ModalForm
                                    trigger={
                                        <Button type="primary">另存为</Button>
                                    }
                                    initialValues={{ 'name': '方案' + Date.now() }}
                                    onFinish={async (values) => {
                                        setLotteryList({
                                            ...lotteryList,
                                            [values.name]: form.getFieldsValue().items
                                        })
                                        return true
                                    }}
                                >
                                    <ProFormText name="name" label=" 抽奖方案名" placeholder="请输入保存名称" />
                                </ModalForm>
                                {
                                    loadedLotteryKey === '' ? null : <Popconfirm
                                        title="是否删除当前方案?"
                                        onConfirm={() => {
                                            delete lotteryList[loadedLotteryKey]
                                            setLotteryList(lotteryList)
                                            form.setFieldsValue(defaultFormValues)
                                            setLotteryConfig({
                                                ...lotteryConfig,
                                                prizes: []
                                            })
                                            setSelectedLottery('')
                                            setLoadedLotteryKey('')
                                        }}
                                        okText="删除"
                                        cancelText="不删除"
                                    >
                                        <Button type="primary" danger>删除方案</Button>
                                    </Popconfirm>
                                }
                            </Space>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={12}>
                    {
                        lotteryConfig.prizes.length > 1 ?
                            <LuckyWheel
                                ref={myLucky}
                                blocks={lotteryConfig.blocks}
                                prizes={lotteryConfig.prizes}
                                buttons={lotteryConfig.buttons}
                                width="300px"
                                height="300px"
                                onStart={() => { // 点击抽奖按钮会触发star回调
                                    myLucky.current.play()
                                    setLoading(true)
                                    // 模拟调用接口异步抽奖
                                    setTimeout(() => {
                                        // 假设后端返回的中奖索引是 0
                                        const index = lotteryFn(form.getFieldsValue().items)
                                        // 调用stop停止旋转并传递中奖索引
                                        myLucky.current.stop(index)
                                    }, 2500)
                                }}
                                onEnd={winCallback} // 抽奖结束会触发end回调
                            /> : null
                    }

                </Col>
            </Row>
            <List
                dataSource={wins}
                rowKey='time'
                header={<div>中奖信息</div>}
                renderItem={
                    (item, index) => (
                        <List.Item>
                            [{index + 1}]:  时间  <Tag color="orange">{item.time.toLocaleString()}</Tag> 中奖项 <Tag color='green'>{item.name}</Tag>
                        </List.Item>
                    )
                }
            >
            </List>
        </Layout>
    </>)
}

