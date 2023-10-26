import { genChartByAiUsingPOST } from '@/services/spring-init/chartController';
import { UploadOutlined } from '@ant-design/icons';
import {Button, Card, Col, Divider, Form, Input, message, Row, Select, Space, Spin, Upload} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import ReactECharts from 'echarts-for-react';
import React, { useState } from 'react';
import {TypeGuard} from "@sinclair/typebox";
import TThis = TypeGuard.TThis;

/**
 * 添加图标页面
 * @constructor
 */
const AddChart: React.FC = () => {
  // 定义状态，用来接收后端的返回值，让它实时展示在页面上
  const [ chart, setChart ] = useState<API.BiResponse>();
  const [ option, setOption ] = useState<any>();
  const [ submitting, setSubmitting ] = useState<boolean>(false);

  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {
    // 如果是已经提交中的状态，直接返回
    if (submitting) {
      return;
    }
    // 开始提交时，将提交状态设置为true
    setSubmitting(true);
    // 如果提交了，把图表数据和图表代码清空掉，防止和之前提交的图标堆叠在一起
    // 如果option清空了，组件就会触发重新渲染，就不会保留之前的历史记录
    setChart(undefined);
    setOption(undefined);
    // 对接后端上传数据
    const params = {
      ...values,
      file: undefined,
    };

    try {
      const res = await genChartByAiUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析成功');
        // 解析成对象，
        const chartOption = JSON.parse(res.data.genChart ?? '');
        if (!chartOption) {
          throw new Error('图表代码解析错误');
        } else {
          setChart(res.data);
          setOption(chartOption);
        }
      }
    } catch (e: any) {
      message.error('分析失败' + e.message);
    }
    // 提交完成后，重新设置提交状态
    setSubmitting(false);
  };

  return (
    // 把页面内容指定一个类名add-chart
    <div className="add-chart">
      <Row gutter={24}>
        <Col span={12}>
        <Form
          // 表单名称改为addChart
          name="addChart"
          onFinish={onFinish}
          // 初始化数据啥都不填，为空
          initialValues={{}}
        >
          <Form.Item
            name="goal"
            label="分析目标"
            rules={[{ required: true, message: '请输入你的分析诉求' }]}
          >
            <TextArea placeholder={'请输入你的分析诉求. 比如：分析网站用户增长情况'} />
          </Form.Item>

          <Form.Item
            name="name"
            label="图标名称"
            rules={[{ required: true, message: '请输入你的图标名称' }]}
          >
            <Input placeholder={'请输入你的图标名称.'} />
          </Form.Item>

          <Form.Item name="chartType" label="图标类型">
            <Select
              options={[
                { value: '折线图', label: '折线图' },
                { value: '柱状图', label: '柱状图' },
                { value: '堆叠图', label: '堆叠图' },
                { value: '饼图', label: '饼图' },
                { value: '雷达图', label: '雷达图' },
              ]}
            />
          </Form.Item>

          <Form.Item name="file" label="原始数据">
            <Upload name="file" maxCount={1}>
              <Button icon={<UploadOutlined />}>上传 CSV 文件</Button>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                提交
              </Button>
              <Button htmlType="reset">重置</Button>
            </Space>
          </Form.Item>
        </Form>
        </Col>
        <Col span={12}>
        <Card title="分析结论">
          {chart?.genResult ?? <div>请先在左侧进行提交</div>}
          <Spin spinning={submitting}/>
        </Card>

        <Divider></Divider>

        <Card title="可视化图表">
          {option ? <ReactECharts option={option} /> : <div>请先在左侧进行提交</div>}
        </Card>
          </Col>
      </Row>
    </div>
  );
};
export default AddChart;
