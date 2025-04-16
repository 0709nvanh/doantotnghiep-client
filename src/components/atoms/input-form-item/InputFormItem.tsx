import { Form, FormItemProps, Input, InputProps } from "antd";

export function InputFormItem(
  props: Readonly<{
    formItemProps?: FormItemProps;
    inputProps?: InputProps;
  }>,
) {
  return (
    <Form.Item
      {...props.formItemProps}
    >
      <Input
        {...props.inputProps}
      />
    </Form.Item>
  );
}

export default InputFormItem;
