import { GRAPHQL_URL } from "@/config";

import type { TypedDocumentString } from "./generated/graphql";

interface GraphQLResponse<TResult> {
  data?: TResult | null;
  errors?: { message: string }[];
}

/**
 * 通过 uni.request 发送 GraphQL 查询
 *
 * 网络失败、HTTP 状态码异常或响应带 errors 时 reject，错误信息可以直接展示给用户。
 */
export function request<TResult, TVariables>(
  document: TypedDocumentString<TResult, TVariables>,
  variables: TVariables,
): Promise<TResult> {
  return new Promise((resolve, reject) => {
    uni.request({
      url: GRAPHQL_URL,
      method: "POST",
      header: { "content-type": "application/json" },
      data: { query: document.toString(), variables },
      timeout: 15000,
      success: (res) => {
        const body = res.data as GraphQLResponse<TResult> | string | undefined;

        if (res.statusCode !== 200 || typeof body !== "object") {
          reject(new Error(`服务暂时不可用（${res.statusCode}）`));
          return;
        }

        const [firstError] = body.errors ?? [];
        if (firstError) {
          reject(new Error(firstError.message));
          return;
        }

        if (!body.data) {
          reject(new Error("服务返回了空数据"));
          return;
        }

        resolve(body.data);
      },
      fail: () => reject(new Error("网络连接失败")),
    });
  });
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
