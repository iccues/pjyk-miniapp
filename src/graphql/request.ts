import Taro from "@tarojs/taro";

import { GRAPHQL_URL } from "@/config";

import type { TypedDocumentString } from "./generated/graphql";

interface GraphQLResponse<TResult> {
  data?: TResult | null;
  errors?: { message: string }[];
}

/**
 * 通过 Taro.request 发送 GraphQL 查询
 *
 * 网络失败、HTTP 状态码异常或响应带 errors 时 reject，错误信息可以直接展示给用户。
 */
export async function request<TResult, TVariables>(
  document: TypedDocumentString<TResult, TVariables>,
  variables: TVariables,
): Promise<TResult> {
  let res: Taro.request.SuccessCallbackResult<GraphQLResponse<TResult> | string | undefined>;
  try {
    res = await Taro.request({
      url: GRAPHQL_URL,
      method: "POST",
      header: { "content-type": "application/json" },
      data: { query: document.toString(), variables },
      timeout: 15000,
    });
  } catch {
    throw new Error("网络连接失败");
  }

  const body = res.data;
  if (res.statusCode !== 200 || typeof body !== "object") {
    throw new Error(`服务暂时不可用（${res.statusCode}）`);
  }

  const [firstError] = body.errors ?? [];
  if (firstError) throw new Error(firstError.message);

  if (!body.data) throw new Error("服务返回了空数据");

  return body.data;
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
