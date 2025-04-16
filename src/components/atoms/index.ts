import { FormItemProps, InputNumberProps, InputProps, SelectProps } from "antd";
import { SearchProps, TextAreaProps } from "antd/es/input";

export type FormItemBaseProps = {
    formItemProps?: FormItemProps;
  };
  
  export type FormItemWithInputProps = {
    inputProps?: InputProps;
  } & FormItemBaseProps;
  
  export type FormItemWithTextAreaProps = {
    textAreaProps?: TextAreaProps;
  } & FormItemBaseProps;
  
  export type FormItemWithInputCurrencyProps = {
    inputCurrencyProps?: InputNumberProps;
  } & FormItemBaseProps;
  
  export type FormItemWithSelectProps = {
    selectProps?: SelectProps;
  } & FormItemBaseProps;
  
  export type FormItemWithSearchProps = {
    inputSearchProps?: SearchProps;
  } & FormItemBaseProps;