import { Form, FormItemProps, Input, InputProps } from "antd";
const { TextArea } = Input;
export function TextAreaFormItem(
  props: Readonly<{
    formItemProps?: FormItemProps;
    inputProps?: InputProps;
  }>,
) {
  return (
    <Form.Item
      {...props.formItemProps}
    >
      <TextArea
        placeholder="Nhập dữ liệu"
        rows={3}
      />
    </Form.Item>
  );
}

export default TextAreaFormItem;
