import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productApi } from "../api/axios";
import { cartApi } from "../api/axios";

interface Product {
    id: string;
    name: string;
    description: string;
    images: string[];
    price: string;
    stock: number;
}

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);
    const customer = localStorage.getItem("email") || "";

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await productApi.get(`/detail/${id}`);
                setProduct(res.data);
            } catch (err: any) {
                setError(err.response?.data?.error || "Error fetching product");
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!product || !customer) return;
        try {
            await cartApi.post("", {
                product_id: product.id,
                customer,
                quantity,
            });
            navigate("/cart");
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to add to cart");
        }
    };

    if (error) return <p className="text-red-600 p-6">{error}</p>;
    if (!product) return <p className="p-6">Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <div className="mb-4">
                {product.images.map((img, i) => (
                    <img
                        key={i}
                        src={img}
                        alt={`Product ${i}`}
                        className="w-full h-64 object-cover mb-2 rounded"
                    />
                ))}
            </div>
            <p className="text-lg text-gray-700 mb-4">{product.description}</p>
            <p className="text-xl text-green-600 font-semibold mb-2">
                ${product.price}
            </p>
            <p className="text-sm text-gray-600 mb-6">Stock: {product.stock}</p>

            <div className="flex items-center gap-4 mb-4">
                <input
                    type="number"
                    min={1}
                    max={product.stock}
                    value={quantity}
                    onChange={(e) =>
                        setQuantity(
                            Math.min(
                                Math.max(1, +e.target.value),
                                product.stock
                            )
                        )
                    }
                    className="border p-2 w-24"
                />
                <button
                    onClick={handleAddToCart}
                    className="bg-blue-600 text-white px-6 py-2 rounded">
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
