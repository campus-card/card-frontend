import {
  OptionsWithExtraProps,
  ProviderContext,
  SnackbarKey,
  SnackbarMessage,
  useSnackbar,
  VariantType
} from 'notistack'

/**
 * 一个用于全局调用的Toast虚空组件, 无需渲染具体内容
 */
let toastRef: ProviderContext
export const ToastConfiguration = () => {
  toastRef = useSnackbar()
  return null
}

// 从源码里面把类型抄一下
type Toast = {
  success: <V extends VariantType>(message: SnackbarMessage, options?: OptionsWithExtraProps<V>) => SnackbarKey
  error: <V extends VariantType>(message: SnackbarMessage, options?: OptionsWithExtraProps<V>) => SnackbarKey
  warning: <V extends VariantType>(message: SnackbarMessage, options?: OptionsWithExtraProps<V>) => SnackbarKey
  info: <V extends VariantType>(message: SnackbarMessage, options?: OptionsWithExtraProps<V>) => SnackbarKey
  toast: <V extends VariantType>(message: SnackbarMessage, type: VariantType, options?: OptionsWithExtraProps<V>) => SnackbarKey
}

// @ts-ignore
const Toast: Toast = {
  success: (message, option?) => Toast.toast(message, 'success', option),
  error: (message, option?) => Toast.toast(message, 'error', option),
  warning: (message, option?) => Toast.toast(message, 'warning', option),
  info: (message, option?) => Toast.toast(message, 'info', option),
  toast: (message, type, option?: OptionsWithExtraProps<any>) => toastRef.enqueueSnackbar(message, { variant: type, ...option })
}

export default Toast
