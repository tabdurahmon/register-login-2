//rrd import
import { Form, useActionData } from "react-router-dom";

//custom hooks
import { useCollection } from "../hooks/useCollection";
//components
import { FormInput } from "../components";
import { useEffect } from "react";
//firebase
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import toast from "react-hot-toast";

//context
import { useGlobalContext } from "../hooks/useGlobalContext";

//action
export const action = async ({ request }) => {
  let formData = await request.formData();
  let title = formData.get("title");
  return { title };
};

function TodoList() {
  const { user } = useGlobalContext();

  const { data } = useCollection(
    "todos",
    ["uid", "==", user.uid],
    ["createdAt"]
  );

  const dataTodo = useActionData();

  const handleDelete = (id) => {
    deleteDoc(doc(db, "todos", id))
      .then(() => {
        toast.success("Deleted todo.");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleCompleted = (id, status) => {
    const todoRef = doc(db, "todos", id);

    updateDoc(todoRef, {
      completed: !status,
    })
      .then(() => {
        toast.success("Updated!");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  useEffect(() => {
    if (dataTodo) {
      const newTodo = {
        ...dataTodo,
        completed: false,
        createdAt: serverTimestamp(),
        uid: user.uid,
      };

      addDoc(collection(db, "todos"), newTodo)
        .then(() => {
          toast.success("New todo added!");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  }, [dataTodo, user.uid]);

  return (
    <div className="container max-mx-auto min-h-[600px] rounded-xl p-5">
      {data &&
        data.map((todo) => {
          return (
            <div key={todo.id} className="flex flex-col w-full">
              <div
                className={`${
                  todo.completed ? "opacity-35 line-through" : "opacity-100"
                }`}
              >
                <h2 className="text-3xl text-center font-serif font-medium">
                  {todo.title}
                </h2>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleCompleted(todo.id, todo.completed)}
                  className="btn bg-blue-950 px-14 my-5"
                >
                  Completed
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="btn btn-square px-14 my-5"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}

      <div>
        <Form method="post">
          <FormInput
            name="title"
            label="Title :"
            type="text"
            placeholder="Create new Todo"
          />
          <button className="btn border-red-600 btn-block">Add</button>
        </Form>
      </div>
    </div>
  );
}

export default TodoList;
