'use client'

import { useState } from "react";
import { changeDone, deleteTodo } from "./actions";

type Todo = {
  id: number,
  title: string,
  done: boolean,
  createdAt: number,
};

export function TodoList({ todos }: { todos: Todo[] }) {
  const [showDone, setShowDone] = useState<boolean>(true);
  const [sortKey, setSortKey] = useState<string>("id");

  const filtered = todos.filter((todo) => showDone || !todo.done);
  if (sortKey === 'done') {
    filtered.sort((a, b) => Number(a.done) - Number(b.done));
  }

  return (
    <div className="w-full">
      <div>
        <svg className="inline" xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="black"><path d="M440-160q-17 0-28.5-11.5T400-200v-240L163.33-742q-14.33-18-4.16-38 10.16-20 32.83-20h576q22.67 0 32.83 20 10.17 20-4.16 38L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-286.67 226-286.66H254l226 286.66Zm0 0Z" /></svg>
        <input type="checkbox" name="showDone" id="showDone" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} />
        <label className="pl-1" htmlFor="showDone">Done</label>
      </div>
      <div>
        <svg className="inline" xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="black"><path d="M120-240v-66.67h240V-240H120Zm0-206.67v-66.66h480v66.66H120Zm0-206.66V-720h720v66.67H120Z" /></svg>
        <select className="appearance-auto" name="sortSelect" id="sortSelect" value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="id">ID</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div className="w-full">
        {
          filtered.map((todo) => (
            <Todo key={`${todo.id}`} value={todo} />
          ))
        }
      </div>
    </div>
  );
}

function Todo(props: { value: Todo }) {
  const { id, title, done, createdAt } = props.value;

  return (
    <div className="relative my-2">
      <div className="absolute top-2 left-2 todo-item-shadow"></div>
      <div className={`${done ? 'bg-zinc-200' : 'bg-white'} group flex flex-row relative p-6 border-[1.5px] border-gray-900`}>
        <div className="flex-none">
          <TodoDoneToggle done={done} action={changeDone.bind(null, id)} />
        </div>
        <div className="pl-4 flex-auto min-w-0">
          <div>
            <span className="text-xl font-bold break-words">{title}</span>
            <span className="ml-2 text-lg opacity-75">#{id}</span>
          </div>
          <div>
            <span className="text-sm opacity-50">{unixEpoch(createdAt).toLocaleString()}</span>
          </div>
        </div>
        <div className="flex-none">
          <TodoDeleteButton action={deleteTodo.bind(null, id)} />
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
