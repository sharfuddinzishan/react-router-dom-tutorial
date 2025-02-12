import { useEffect } from "react";
import {
  Form,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { createContact, getContacts } from "../contacts";

export default function Root() {
  const { contacts, q } = useLoaderData();
  const submit = useSubmit();
  console.log("search ", q);
  const navigation = useNavigation();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");
  console.log("searchStatus ", searching);
  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);
  return (
    <>
      {console.log("Rendering")}
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => {
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts?.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`/contacts/${contact.id}`}
                    // className={({ isActive, isPending }) =>
                    //   isActive ? "active" : isPending ? "pending" : ""
                    // }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}{" "}
                        {contact.favorite ? "★" : "☆"}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <i>No Contacts</i>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}

export async function loader({ request }) {
  console.log("loader root");
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

export async function action() {
  console.log("action");
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
  // return { contact };
}
