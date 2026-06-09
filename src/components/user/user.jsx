import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../user/user.scss";
import "../buy/buypage.scss";
import "../favourite/favourite.scss";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [myCars, setMyCars] = useState([]);
  const [loading, setLoading] = useState(true);


  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const navigate = useNavigate();

  
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem("user");

        if (savedUser && savedUser !== "undefined") {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser && parsedUser.id) {
            setUser(parsedUser);
            setName(parsedUser.name || "");
            setPhone(parsedUser.phone || "");
            if (parsedUser.avatar) {
              setAvatarPreview(`http://localhost:5001${parsedUser.avatar}`);
            }
          } else {
            throw new Error("Invalid user data");
          }
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Auth error:", err);
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);


  const fetchMyCars = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/my-cars/${userId}`
      );
      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      setMyCars(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Помилка завантаження машин:", err);
    }
  };


  useEffect(() => {
    if (user?.id) {
      fetchMyCars(user.id);
    }
  }, [user?.id]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    try {
      const data = new FormData();
      data.append("name", name);
      data.append("phone", phone);
      if (avatar) {
        data.append("avatar", avatar);
      }

      const response = await fetch(
        `http://localhost:5001/api/auth/users/${user.id}`,
        {
          method: "PUT",
          body: data,
        }
      );
      if (!response.ok) throw new Error("Помилка при оновленні");

      const updatedData = await response.json();

      const newUserObj = {
        ...user,
        name: updatedData.name,
        phone: updatedData.phone,
        avatar: updatedData.avatar,
      };

      localStorage.setItem("user", JSON.stringify(newUserObj));
      setUser(newUserObj);
      setIsEditing(false);
      alert("Профіль успішно оновлено!");
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Не вдалося зберегти зміни");
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm("Ви впевнені?")) return;

    try {
      const response = await fetch(`http://localhost:5001/api/cars/${carId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMyCars((prev) => prev.filter((car) => car.id !== carId));
      }
    } catch (err) {
      console.error("Помилка видалення:", err);
    }
  };

  if (loading)
    return <div className="profile-loading">Loading profile... </div>;
  if (!user) return null;

  return (
    <div className="__container_profilepage">
      <div className="sub-body profile_sub-body">
        <div className="sub-body__2 profile_sub-body__2">
          <div className="profile_flex_container">
            
            {/* ЛІВИЙ БЛОК: ДАНІ КОРИСТУВАЧА */}
            <div className="container_profile container_profile_1">
              <div className="user-info-card __shadows">
                
                <div className="container_userpage_sub container_userpage_sub_1">
                  <div className="avatar-section">
                  <div className="avatar-wrapper">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="user-avatar"
                      />
                    ) : (
                      <div className="avatar-placeholder">👤</div>
                    )}
                    {isEditing && (
                      <label className="upload-avatar-btn">
                        📸
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          style={{ display: "none" }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="profile-fields">
                  <p>
                    <strong>E-mail:</strong> {user?.email || "Не вказано"}
                  </p>

                  <div className="field-group">
                    <strong className="p_strong_profilepage">Name: </strong>
                    {isEditing ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Vanya"
                        className="filter-input filter-input_userpage"
                      />
                    ) : (
                      <strong>{user?.name || "Не вказано"}</strong>
                    )}
                  </div>

                  <div className="field-group">
                    <strong className="p_strong_profilepage">Phone number: </strong>
                    {isEditing ? (
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+380(097)7777777"
                        className="filter-input filter-input_userpage"
                      />
                    ) : (
                      <strong>{user?.phone || "Не вказано"}</strong>
                    )}
                  </div>

                  <p>
                    <strong>User ID: </strong> {user?.id || "ID відсутній"}
                  </p>
                </div>

                </div>

                <div className="container_userpage_sub container_userpage_sub_2">
                  <div className="edit-profile-actions">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveProfile}
                        className="btn-save-profile bulk-btn"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setAvatarPreview(
                            user.avatar
                              ? `http://localhost:5001${user.avatar}`
                              : ""
                          );
                        }}
                        className="btn-cancel-profile bulk-btn"
                      >
                        Denied
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bulk-btn bulk-btn_userpage btn-save-profile"
                    >
                      Configure profile
                    </button>
                  )}
                  
                  <div className="profile-actions">
                    <button
                      onClick={() => {
                        localStorage.clear();
                        navigate("/login");
                      }}
                      className="bulk-btn bulk-btn_userpage bulk-btn_userpage_1"
                    >
                      Exit profile
                    </button>
                  </div>
                </div>
                </div>

                
              </div>
            </div>

            {/* ПРАВИЙ БЛОК: ВАШІ ОГОЛОШЕННЯ (СІТКА) */}
            <div className="container_profile container_profile_2">
              <div className="user-cars-section container_profile_1">
                <div className="__shadows">
                  <p className="p_buypage_filtration __paddings_buypage">Your cars: </p>
                </div>
                
                {myCars.length === 0 ? (
                  <p className="no-cars-text">You dont have car on sale</p>
                ) : (
                  <div className="cars-list-container __shadows">
                    {myCars.map((car) => (
                      <div key={car.id} className="user-car-row __shadows_mini">
                        {car.images && car.images !== "null" && (
                          <img
                            src={`http://localhost:5001${
                              JSON.parse(car.images)[0]
                            }`}
                            alt="car"
                            className="user-car-img"
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        )}

                        <div className="user-car-info">
                          <p className="p_strong_profilepage">
                            {car.brand} {car.model}
                          </p>
                          <p className="p_strong_profilepage">
                            Price: <strong>${car.price}</strong>
                          </p>
                          <button
                          onClick={() => handleDelete(car.id)}
                          className="bulk-btn "
                        >
                          Видалити
                        </button>
                        </div>

                        
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;