import { useState, useReducer } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

import axios from 'axios';

// Define the reducer function
function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, data: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function SearchBox() {
  const initialState = { loading: false, data: null, error: null };
  const [state, dispatch] = useReducer(reducer, initialState);
  const [query, setQuery] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "FETCH_REQUEST" });
    try {
      const result = await axios.get("/products/search?query=" + query);
      dispatch({ type: "FETCH_SUCCESS", payload: result.data })
    } catch (err) {
      dispatch({ type: "FETCH_FAIL", payload: err.message })
    }
  }

  return (
    <Form className="d-flex me-auto" onSubmit={submitHandler}>
      <InputGroup>
        <FormControl
          type="text"
          name="q"
          id="q"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search products..."
          aria-label="Search Products"
          aria-describedby="button-search"
        />
        <Button variant="outline-primary" type="submit" id="button-search">
          <i className="fas fa-search"></i>
        </Button>
      </InputGroup>
    </Form>
  );
}
