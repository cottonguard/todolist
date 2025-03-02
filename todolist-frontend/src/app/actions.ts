'use server'

import { revalidateTag } from "next/cache";

export async function changeDone(id: number, done: boolean) {
    'use server'
    const res = await fetch('http://localhost:4000/todo/done', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, done }),
    });
    if (res.ok) {
        const { succsess }: { succsess: boolean } = await res.json();
        if (!succsess) {
            console.log('failed to changeDone');
        }
        revalidateTag('todoList');
    }
}

export async function deleteTodo(id: number) {
    'use server'
    const res = await fetch('http://localhost:4000/todo', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
    });
    if (res.ok) {
        const { succsess }: { succsess: boolean } = await res.json();
        if (!succsess) {
            console.log('failed to deleteTodo');
        }
        revalidateTag('todoList');
    }
}