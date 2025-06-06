import { ref } from 'vue'
import { sdkClient } from '@/services/sdk'
import type { Paginated } from '@feathersjs/feathers'

export type ServiceRecordParams = {
  workspace: string
  datasource: string
  table: string
}

function getServiceName(serviceParams: ServiceRecordParams) {
  return (
    '/workspace/' +
    serviceParams.workspace +
    '/datasource/' +
    serviceParams.datasource +
    '/table/' +
    serviceParams.table +
    '/record'
  )
}
export function useRecords<T = any>() {
  const state = ref({
    loading: false,
    records: [] as T[],
    total: 0,
    sort: {},
    filter: {},
    error: null as Error | null,
    alreadyFetched: new Set(),
  })

  async function fetchRecords(
    serviceParams: ServiceRecordParams,
    query: {
      $skip: number
      $limit: number
    } = { $skip: 0, $limit: 50 },
  ) {
    /**
     * compute if Set to fetch is already fetched
     */
    // const setToFetch = new Set()
    // for (
    //   let i = query.$skip;
    //   i++;
    //   i <= query.$skip + query.$limit || i < state.value.total - query.$skip
    // ) {
    //   setToFetch.add(i)
    // }

    // if (state.value.alreadyFetched.difference(setToFetch).size === 0) return

    state.value.loading = true
    state.value.records = []
    try {
      // retrieve records
      const recordResponse = (await sdkClient.service(getServiceName(serviceParams)).find({
        query,
      })) as Paginated<T>
      /**
       * If our actual records array is empty,
       * we create a new one for the total records found
       * and fill it at the right first / end
       */
      // let items
      // if (state.value.records.length === 0 || state.value.total !== recordResponse.total) {
      //   items = Array.from({ length: recordResponse.total })
      // } else {
      //   items = [...state.value.records]
      // }
      // recordResponse.data.forEach((d, index) => {
      //   items[index + query.$skip] = d
      // })
      state.value.records = recordResponse.data
      state.value.total = recordResponse.total
    } catch (error) {
      state.value.error = error as Error
      console.error(error)
    }
    state.value.loading = false
  }

  async function createRecord(serviceParams: ServiceRecordParams, data: T) {
    return await sdkClient.service(getServiceName(serviceParams)).create(data)
  }

  async function patchRecord(
    serviceParams: ServiceRecordParams,
    id: number | string,
    data: Partial<T>,
  ) {
    return await sdkClient.service(getServiceName(serviceParams)).patch(id, data)
  }

  async function removeRecord(serviceParams: ServiceRecordParams, id: number | string) {
    return await sdkClient.service(getServiceName(serviceParams)).remove(id)
  }

  return {
    state,
    fetchRecords,
    createRecord,
    patchRecord,
    removeRecord,
  }
}
