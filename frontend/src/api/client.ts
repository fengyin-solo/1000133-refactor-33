/** 统一请求封装：拼后端地址、判断响应状态、把异常转成一句可读文案。 */
const API_BASE = import.meta.env.VITE_API_BASE ?? ''

export function request(path: string, init?: RequestInit): Promise<Response> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  return fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  }).catch((error: unknown) => {
    const detail = error instanceof Error ? error.message : '请求未送达'
    throw new Error(`接口请求失败：${detail}`)
  })
}

/** 非 Error 异常（理论上不会出现）统一走兜底文案，避免把空内容显示到页脚。 */
export function toErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

/** 发出请求并校验响应状态；非 2xx 时抛出调用方声明的失败文案。 */
async function sendOrThrow(path: string, failedMessage: string, init?: RequestInit): Promise<Response> {
  const response = await request(path, init)
  if (!response.ok) {
    throw new Error(failedMessage)
  }
  return response
}

/** 只关心动作是否生效：非 2xx 抛 failedMessage，不解析响应体。 */
export async function ensureOk(path: string, failedMessage: string, init?: RequestInit): Promise<void> {
  await sendOrThrow(path, failedMessage, init)
}

/** 读取接口数据：非 2xx 抛 failedMessage，成功时解析 JSON。 */
export async function readJson<T>(path: string, failedMessage: string, init?: RequestInit): Promise<T> {
  const response = await sendOrThrow(path, failedMessage, init)
  return (await response.json()) as T
}

export async function fetchJson<T>(path: string): Promise<T> {
  const response = await request(path)
  if (!response.ok) {
    throw new Error(`接口返回 ${response.status}，数据未更新`)
  }
  return (await response.json()) as T
}
