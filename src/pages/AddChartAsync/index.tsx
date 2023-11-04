import {
  genChartByAiAsyncMqUsingPOST,
  genChartByAiAsyncUsingPOST,
  genChartByAiUsingPOST
} from '@/services/spring-init/chartController';
import {UploadOutlined} from '@ant-design/icons';
import {Button, Card, Form, Input, message, Select, Space, Upload} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, {useState} from 'react';
import {useForm} from "antd/es/form/Form";


/**
 * 添加图标页面
 * @constructor
 */
const AddChartAsync: React.FC = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = useForm();

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
    // 对接后端上传数据
    const params = {
      ...values,
      file: undefined,
    };

    try {
      const res = await genChartByAiAsyncMqUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析任务提交成功，请在我的图表页面进行查看');
      }
    } catch (e: any) {
      message.error('分析失败' + e.message);
    }
    // 提交完成后，重新设置提交状态
    setSubmitting(false);
  };

  return (
    // 把页面内容指定一个类名add_chart_async

    <div className="add_chart_async">
      <Card title={"智能分析"}>
        <Form
          // 当任务提交成功后，清除表单
          form={form}
          // 表单名称改为addChartAsync
          name="addChartAsync"
          onFinish={onFinish}
          // 初始化数据啥都不填，为空
          initialValues={{}}
        >
          <Form.Item
            name="goal"
            label="分析目标"
            rules={[{required: true, message: '请输入你的分析诉求'}]}
          >
            <TextArea placeholder={'请输入你的分析诉求. 比如：分析网站用户增长情况'}/>
          </Form.Item>

          <Form.Item
            name="name"
            label="图标名称"
            rules={[{required: true, message: '请输入你的图标名称'}]}
          >
            <Input placeholder={'请输入你的图标名称.'}/>
          </Form.Item>

          <Form.Item name="chartType" label="图标类型">
            <Select
              options={[
                {value: '折线图', label: '折线图'},
                {value: '柱状图', label: '柱状图'},
                {value: '堆叠图', label: '堆叠图'},
                {value: '饼图', label: '饼图'},
                {value: '雷达图', label: '雷达图'},
              ]}
            />
          </Form.Item>

          <Form.Item name="file" label="原始数据">
            <Upload name="file" maxCount={1}>
              <Button icon={<UploadOutlined/>}>上传 CSV 文件</Button>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{span: 12, offset: 6}}>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                提交
              </Button>
              <Button htmlType="reset">重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default AddChartAsync;
