import { onMounted, ref } from 'vue'

import { ensureOk, readJson, toErrorMessage } from '@/api/client'

type Row = Record<string, string | number | null>

type PagePayload = {
  items?: Row[]
  total?: number
}

/** 页面只声明接口路径与各类失败文案；请求、状态判断、异常转换都在这里统一处理。 */
export type ModulePageOptions = {
  /** 模块列表接口前缀，例如 /api/order */
  endpoint: string
  /** 表格列；前 3 列同时作为筛选条件输入项 */
  columns: readonly string[]
  /** 列表加载失败（含后端非 2xx）时的页脚文案 */
  loadFailedMessage: string
  /** 列表加载发生异常时的兜底文案 */
  loadErrorMessage: string
  /** 行动作未生效（后端非 2xx）时的页脚文案 */
  actionFailedMessage: string
  /** 行动作发生异常时的兜底文案 */
  actionErrorMessage: string
  /** 登记入口尚未接入时的提示文案 */
  notReadyMessage: string
}

export function useModulePage(options: ModulePageOptions) {
  const { endpoint } = options
  const rows = ref<Row[]>([])
  const total = ref(0)
  const errorMessage = ref('')
  const filters = ref<Record<string, string>>({})

  function resetFilters() {
    filters.value = {}
    void reload()
  }

  function exportRows() {
    window.open(`${endpoint}/export`, '_blank')
  }

  function openCreate() {
    errorMessage.value = options.notReadyMessage
  }

  async function runAction(action: string, row: Row) {
    errorMessage.value = ''
    try {
      await ensureOk(
        `${endpoint}/${row.id}/actions`,
        options.actionFailedMessage,
        {
          method: 'POST',
          body: JSON.stringify({ action }),
        },
      )
      await reload()
    } catch (error) {
      errorMessage.value = toErrorMessage(error, options.actionErrorMessage)
    }
  }

  async function reload() {
    errorMessage.value = ''
    const query = new URLSearchParams(filters.value).toString()
    try {
      const payload = await readJson<PagePayload>(`${endpoint}?${query}`, options.loadFailedMessage)
      rows.value = payload.items ?? []
      total.value = payload.total ?? rows.value.length
    } catch (error) {
      errorMessage.value = toErrorMessage(error, options.loadErrorMessage)
    }
  }

  onMounted(reload)

  return {
    rows,
    total,
    errorMessage,
    filters,
    filterFields: options.columns.slice(0, 3),
    resetFilters,
    exportRows,
    openCreate,
    runAction,
    reload,
  }
}
