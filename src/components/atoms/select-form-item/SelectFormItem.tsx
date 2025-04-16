import { Form, Select } from "antd";
import { FormItemWithSelectProps } from "..";

export function SelectFormItem(props: FormItemWithSelectProps) {
  return (
    <Form.Item {...props.formItemProps}>
      <Select {...props.selectProps} />
    </Form.Item>
  );
}
