import { revalidateTag } from "next/cache";
import { TodoList } from "./todolist";

type Todos = { todos: Todo[] };
type Todo = {
  id: number,
  title: string,
  done: boolean,
  createdAt: number,
};

export default async function Home() {
  // FIXME: URL
  const data = await fetch('http://localhost:4000/todo', { next: { tags: ['todoList'] } });
  const todos: Todos = await data.json();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="w-xl flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <CreateTodoForm />
        <TodoList todos={todos.todos} />
      </main>
    </div>
  );
}

function CreateTodoForm() {
  async function createTodo(data: FormData) {
    'use server'
    const res = await fetch('http://localhost:4000/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: data.get('title'),
      }),
    });
    if (res.ok) {
      const { succsess }: { succsess: boolean } = await res.json();
      if (!succsess) {
        console.log('failed to createTodo');
      }
      revalidateTag('todoList');
    }
  }

  return (
    <form action={createTodo} className="w-full relative">
      <input type="text" name="title" id="title-textbox" placeholder="New ToDo" className="block w-full px-6 py-3 border-3 text-xl font-bold" />
    </form>
  );
}
