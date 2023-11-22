import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { IDuty } from "./types";

const baseURL = import.meta.env.VITE_REACT_APP_API_HOST
    ? import.meta.env.VITE_REACT_APP_API_HOST
    : "http://localhost:3000";

const fetcher = (url: string) =>
    fetch(`${baseURL}${url}`, { credentials: "same-origin" }).then((res) =>
        res.json()
    );

async function createItem(url: string, { arg }: { arg: string }) {
    return await fetch(`${baseURL}${url}`, {
        method: "POST",
        body: JSON.stringify({ name: arg }),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => res.json());
}

async function updateItem(
    url: string,
    { arg }: { arg: { id: number; name: string } }
) {
    return await fetch(`${baseURL}${url}/${arg.id}`, {
        method: "PUT",
        body: JSON.stringify({ name: arg.name }),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => res.json());
}

async function deleteItem(url: string, { arg }: { arg: number }) {
    return await fetch(`${baseURL}${url}/${arg}`, {
        method: "DELETE",
    }).then((res) => res.json());
}

// TODO pagination
export function useGetItemList() {
    const { data, error, isLoading } = useSWR<IDuty[]>(`/todos`, fetcher);

    return {
        data: data || null,
        isLoading,
        isError: error,
    };
}

export function useAddItem() {
    const { data, trigger, error, isMutating } = useSWRMutation(
        `/todos`,
        createItem
    );
    return {
        data,
        trigger,
        error,
        isMutating,
    };
}

export function useEditItem() {
    const { data, trigger } = useSWRMutation(`/todos`, updateItem);
    return {
        data,
        trigger,
    };
}

export function useDeleteItem() {
    const { data, trigger } = useSWRMutation(`/todos`, deleteItem);
    return {
        data,
        trigger,
    };
}
