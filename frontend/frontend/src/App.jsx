import { useEffect, useState } from "react";

const API = "/api";

function App() {
  const [stalls, setStalls] = useState([]);

  const [form, setForm] = useState({
    stallName: "",
    productCategory: "",
    dailyRevenue: "",
    open: "true"
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Display all stalls
  async function loadStalls() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/DisplayAll`);

      if (!response.ok) {
        throw new Error("Failed to load stalls");
      }

      const data = await response.json();

      setStalls(data);
    } catch (err) {
      setError(
        err.message + ". Check whether the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  // Load records when the page opens
  useEffect(() => {
    let cancelled = false;

    async function fetchStalls() {
      try {
        const response = await fetch(`${API}/DisplayAll`);

        if (!response.ok) {
          throw new Error("Failed to load stalls");
        }

        const data = await response.json();

        if (!cancelled) {
          setStalls(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message + ". Check whether the backend is running."
          );
        }
      }
    }

    fetchStalls();

    return () => {
      cancelled = true;
    };
  }, []);

  // Handle form input
  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  }

  // Add new stall
  async function addStall(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!form.stallName.trim()) {
      setError("Please enter the stall name.");
      return;
    }

    if (!form.productCategory.trim()) {
      setError("Please enter the product category.");
      return;
    }

    if (
      form.dailyRevenue === "" ||
      !Number.isFinite(Number(form.dailyRevenue)) ||
      Number(form.dailyRevenue) < 0
    ) {
      setError("Please enter a valid daily revenue.");
      return;
    }

    const stall = {
      stallName: form.stallName.trim(),
      productCategory: form.productCategory.trim(),
      dailyRevenue: Number(form.dailyRevenue),
      open: form.open === "true"
    };

    setSaving(true);

    try {
      const response = await fetch(`${API}/Add`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(stall)
      });

      if (!response.ok) {
        throw new Error("Failed to add stall");
      }

      setMessage("Stall added successfully!");

      setForm({
        stallName: "",
        productCategory: "",
        dailyRevenue: "",
        open: "true"
      });

      await loadStalls();
    } catch (err) {
      setError(err.message + ". Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // Delete stall
  async function deleteStall(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this stall?"
    );

    if (!confirmDelete) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API}/Delete/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete stall");
      }

      setMessage("Stall deleted successfully!");

      await loadStalls();
    } catch (err) {
      setError(err.message + ". Please try again.");
    }
  }

  return (
    <>
      {/* Navigation bar */}
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            LocalMarketStall
          </a>

          <div className="d-flex gap-3">
            <a className="nav-link text-white" href="#add">
              Add Stall
            </a>

            <a className="nav-link text-white" href="#records">
              View Stalls
            </a>
          </div>
        </div>
      </nav>

      <main className="container py-4">

        {/* Project heading */}
        <div className="mb-4">
          <h1 className="fw-bold">
            Local Market Stall Management
          </h1>

          <p className="text-secondary">
            Add, display and manage local market stall records.
          </p>
        </div>

        {/* Success message */}
        {message && (
          <div className="alert alert-success">
            {message}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* Add stall form */}
        <section id="add" className="card shadow-sm mb-4">

          <div className="card-header fw-bold">
            Add New Stall
          </div>

          <div className="card-body">

            <form onSubmit={addStall}>

              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label">
                    Stall Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="stallName"
                    value={form.stallName}
                    onChange={handleChange}
                    placeholder="Enter stall name"
                    maxLength={100}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Product Category
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="productCategory"
                    value={form.productCategory}
                    onChange={handleChange}
                    placeholder="Enter product category"
                    maxLength={100}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Daily Revenue
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    name="dailyRevenue"
                    value={form.dailyRevenue}
                    onChange={handleChange}
                    placeholder="Enter daily revenue"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Stall Status
                  </label>

                  <select
                    className="form-select"
                    name="open"
                    value={form.open}
                    onChange={handleChange}
                  >
                    <option value="true">Open</option>
                    <option value="false">Closed</option>
                  </select>
                </div>

              </div>

              <button
                type="submit"
                className="btn btn-primary mt-3"
                disabled={saving}
              >
                {saving ? "Adding..." : "Add Stall"}
              </button>

            </form>

          </div>
        </section>

        {/* Display stalls */}
        <section id="records" className="card shadow-sm">

          <div className="card-header d-flex justify-content-between align-items-center">

            <span className="fw-bold">
              Stall Records
            </span>

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={loadStalls}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>

          </div>

          <div className="card-body">

            {loading ? (
              <div className="text-center py-3">
                Loading stalls...
              </div>
            ) : stalls.length === 0 ? (
              <div className="text-center text-secondary py-3">
                No stalls available. Add your first stall.
              </div>
            ) : (

              <div className="table-responsive">

                <table className="table table-striped table-hover">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Stall Name</th>
                      <th>Category</th>
                      <th>Daily Revenue</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>

                    {stalls.map((stall) => (

                      <tr key={stall.id}>

                        <td>{stall.id}</td>

                        <td>{stall.stallName}</td>

                        <td>{stall.productCategory}</td>

                        <td>{stall.dailyRevenue}</td>

                        <td>
                          <span
                            className={
                              stall.open
                                ? "badge bg-success"
                                : "badge bg-secondary"
                            }
                          >
                            {stall.open ? "Open" : "Closed"}
                          </span>
                        </td>

                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteStall(stall.id)}
                          >
                            Delete
                          </button>
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>
        </section>

      </main>

      <footer className="text-center text-secondary py-4">
        LocalMarketStall Management System
      </footer>
    </>
  );
}

export default App;