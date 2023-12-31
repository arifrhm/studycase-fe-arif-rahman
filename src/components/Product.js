import React, { useContext } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import axios from "axios";
import { Store } from "../Store";
import { idrFormat } from "../utils";

const Product = (props) => {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/products/byid/${item._id}`);
    if (data.countInStocke < quantity) {
      window.alert("Maaf, produk tidak tersedia");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  return (
    <Card>
      <Link to={`/products/detail/${product._id}`}>
        <img src={`/uploads/products/${product.image}`} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/products/detail/${product._id}`} className="linkon">
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Link
          to={{ pathname: "/search", search: `?category=${product.category}` }}
          className="criteria"
        >
          {product.category}
        </Link>{" "}
        |{" "}
        <Link
          to={{ pathname: "/search", search: `?tag=${product.tag}` }}
          className="criteria"
        >
          {product.tag}
        </Link>
        <Rating
          rating={product.rating}
          // numReviews={product.numReviews}
        ></Rating>
        <Card.Text>{idrFormat(product.price)}</Card.Text>
        {product.countInStocke === 0 ? (
          <Button variant="primary" disabled>
            Habis
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;
