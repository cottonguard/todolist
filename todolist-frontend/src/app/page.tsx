import { revalidateTag } from "next/cache";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="w-xl flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <CreateTodoForm />
        <TodoList />
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


type Todos = { todos: Todo[] };
type Todo = {
  id: number,
  title: string,
  done: boolean,
  createdAt: number,
};

async function TodoList() {
  // FIXME: URL
  const data = await fetch('http://localhost:4000/todo', { next: { tags: ['todoList'] } });
  const todos: Todos = await data.json();
  return (
    <div className="w-full">
      {todos.todos.map((todo) => (
        <Todo key={`${todo.id}`} value={todo} />
      ))}
    </div>
  );
}

function Todo(props: { value: Todo }) {
  const { id, title, done, createdAt } = props.value;

  async function changeDone(done: boolean) {
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

  async function deleteTodo() {
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

  return (
    <div className="relative my-2">
      <div className="absolute top-2 left-2 todo-item-shadow"></div>
      <div className={`${done ? 'bg-zinc-200' : 'bg-white'} group flex flex-row relative p-6 border-[1.5px] border-gray-900`}>
        <div className="flex-none">
          <TodoDoneToggle done={done} action={changeDone} />
        </div>
        <div className="pl-4 flex-auto min-w-0">
          <div>
            <span className="text-xl font-bold break-words">{title}</span>
            <span className="ml-2 text-lg opacity-75">#{id}</span>
          </div>
          <div>
            <span className="text-sm opacity-50">{unixEpoch(createdAt).toString()}</span>
          </div>
        </div>
        <div className="flex-none">
          <TodoDeleteButton action={deleteTodo} />
        </div>
      </div>
    </div >
  );
}

function TodoDoneToggle({ done, action }: { done: boolean, action: (done: boolean) => void }) {
  return (
    <form action={action.bind(null, !done)}>
      {
        done ? (
          <button type="submit"
            className="relative size-9 border-4 border-gray-900 bg-gray-100 cursor-pointer inset-shadow-sm shadow-[inset_2.5px_2.5px_rgba(0,0,0,0.25)]">
            <div className="absolute top-[50%] left-[50%] translate-x-[calc(6px-50%)] -translate-y-1/2 hover:opacity-50">
              <svg className="fill-green-500" xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px"><path d="M378-222 130-470l68-68 180 180 383-383 68 68-451 451Z" /></svg>
            </div>
          </button>
        ) : (
          <button type="submit"
            className="relative size-9 border-4 border-gray-900 bg-gray-100 cursor-pointer inset-shadow-sm shadow-[inset_2.5px_2.5px_rgba(0,0,0,0.25)]">
            <div className="absolute top-[50%] left-[50%] translate-x-[calc(6px-50%)] -translate-y-1/2 opacity-0 hover:opacity-50">
              <svg className="fill-green-500" xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px"><path d="M378-222 130-470l68-68 180 180 383-383 68 68-451 451Z" /></svg>
            </div>
          </button>
        )
      }
    </form>
  );
}

function TodoDeleteButton({ action }: { action: () => void }) {
  return (
    <form action={action}>
      <button className="invisible p-1 border-[1.5px] border-transparent rounded-sm text-red-600 group-hover:visible group-hover:cursor-pointer hover:bg-current/8 hover:border-current">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </button>
    </form>
  );
}

function addButton() {
  return (
    <button type="submit" className="absolute bottom-1 right-1 flex place-content-center place-items-center size-12 rounded-full cursor-pointer bg-linear-to-br from-emerald-500 via-teal-500 via-40% to-fuchsia-600">
      <svg className="size-12 fill-white" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg>
    </button>
  );
}

function unixEpoch(t: number): Date {
  return new Date(1000 * t);
}
