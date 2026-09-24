import { onMounted, ref } from 'vue'

import { request } from '@/api/client'

export type Row = Record<string, string | number | null>

/** 列表页各环节的失败文案，由页面按自己的业务对象声明。 */
export interface ListPageMessages {
  /** 点击“登记”按钮时给出的提示 */
  createHint: string
  /** 动作接口返回非 2xx 时的提示 */
  actionFailed: string
  /** 动作请求异常的兜底文案 */
  actionFallback: string
  /** 列表接口返回非 2xx 时的提示 */
  loadFailed: string
  /** 列表请求异常的兜底文案 */
  loadFallback: string
}

/**
 * 模块列表页共用实现：列表加载、动作提交、筛选重置、导出与失败提示
 * 都收拢在这里，页面只需声明接口路径和各环节文案。
 */
export function useListPage(endpoint: string, messages: ListPageMessages) {
  const rows = ref<Row[]>([])
  const total = ref(0)
  const errorMessage = ref('')
  const filters = ref<Record<string, string>>({})

  async function reload() {
    errorMessage.value = ''
    const query = new URLSearchParams(filters.value).toString()
    try {
      const response = await request(`${endpoint}?${query}`)
      if (!response.ok) {
        throw new Error(messages.loadFailed)
      }
      const payload = await response.json()
      rows.value = payload.items ?? []
      total.value = payload.total ?? rows.value.length
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : messages.loadFallback
    }
  }

  async function runAction(action: string, row: Row) {
    errorMessage.value = ''
    try {
      const response = await request(`${endpoint}/${row.id}/actions`, {
        method: 'POST',
        body: JSON.stringify({ action }),
      })
      if (!response.ok) {
        throw new Error(messages.actionFailed)
      }
      await reload()
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : messages.actionFallback
    }
  }

  function resetFilters() {
    filters.value = {}
    void reload()
  }

  function exportRows() {
    window.open(`${endpoint}/export`, '_blank')
  }

  function openCreate() {
    errorMessage.value = messages.createHint
  }

  onMounted(reload)

  return {
    rows,
    total,
    errorMessage,
    filters,
    reload,
    runAction,
    resetFilters,
    exportRows,
    openCreate,
  }
}
