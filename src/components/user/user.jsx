import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./user.scss";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [myCars, setMyCars] = useState([]);
  const [showCars, setShowCars] = useState(false);
  const [loading, setLoading] = useState(true);

  // Стейти для кастомізації профілю
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
            // Заповнюємо поля початковими даними з бази/локалсториджу
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

  // Обробник вибору аватарки
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file)); // Тимчасове посилання для прев'ю
    }
  };

  // Збереження оновлених даних профілю
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
          method: "PUT", // метод залишається PUT, тут усе правильно
          body: data,
        },
      );
      if (!response.ok) throw new Error("Помилка при оновленні");

      const updatedData = await response.json();

      // Формуємо новий об'єкт юзера для перезапису в localStorage
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

  const fetchMyCars = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `http://localhost:5001/api/my-cars/${user.id}`,
      );
      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      setMyCars(Array.isArray(data) ? data : []);
      setShowCars(true);
    } catch (err) {
      console.error("Помилка завантаження машин:", err);
      alert("Не вдалося завантажити список оголошень");
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
    return <div className="profile-loading">Завантаження профілю...</div>;
  if (!user) return null;

  return (
    <div className="__container_profilepage">
      <h1>Мій профіль</h1>

      <div className="user-info-card">
        {/* Клієнтська зона аватара */}
        <div className="avatar-section">
          <div className="avatar-wrapper">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="user-avatar" />
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

        {/* Поля профілю */}
        <div className="profile-fields">
          <p>
            <strong>Email:</strong> {user?.email || "Не вказано"}
          </p>

          <div className="field-group">
            <strong>Ім'я:</strong>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше ім'я"
                className="profile-input"
              />
            ) : (
              <span>{user?.name || "Не вказано"}</span>
            )}
          </div>

          <div className="field-group">
            <strong>Телефон:</strong>
            {isEditing ? (
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+380..."
                className="profile-input"
              />
            ) : (
              <span>{user?.phone || "Не вказано"}</span>
            )}
          </div>

          <p className="user-id-text">
            <strong>User ID:</strong> {user?.id || "ID відсутній"}
          </p>
        </div>

        {/* Кнопки керування кастомізацією */}
        <div className="edit-profile-actions">
          {isEditing ? (
            <>
              <button onClick={handleSaveProfile} className="btn-save-profile">
                Зберегти
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setAvatarPreview(
                    user.avatar ? `http://localhost:5001${user.avatar}` : "",
                  );
                }}
                className="btn-cancel-profile"
              >
                Скасувати
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-edit-profile"
            >
              Налаштувати профіль
            </button>
          )}
        </div>
      </div>

      <div className="profile-actions">
        <button onClick={fetchMyCars} className="btn-show-cars">
          Показати мої діючі оголошення
        </button>

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="btn-logout"
        >
          Вийти
        </button>
      </div>

      {showCars && (
        <div className="user-cars-section">
          <h2>Ваші оголошення</h2>
          {myCars.length === 0 ? (
            <p>У вас ще немає оголошень.</p>
          ) : (
            <div className="cars-list-container">
              {myCars.map((car) => (
                <div key={car.id} className="user-car-row">
                  {car.images && car.images !== "null" && (
                    <img
                      src={`http://localhost:5001${JSON.parse(car.images)[0]}`}
                      alt="car"
                      className="user-car-img"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}

                  <div className="user-car-info">
                    <h3>
                      {car.brand} {car.model}
                    </h3>
                    <p>
                      Ціна: <span>${car.price}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(car.id)}
                    className="btn-delete-car"
                  >
                    Видалити
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
