// src/pages/Login.jsx
import '../components/css/login.css';
import api from "../api/axiosConfig.js";
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import '/src/components/css/HeartbeatLogo.css';   // ✅ 절대경로
import HeartbeatLogo from '../components/layout/HeartbeatLogo';

function Login() {
  const [empEmail, setEmpEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const from = location.state?.from?.pathname || "/home";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/v1/emp/login", {
        empEmail: empEmail,
        password: password
      });
      if (response.data && response.data.empNum) {
        const user = response.data;
        dispatch({ type: "USER_INFO", payload: user });
        sessionStorage.setItem("user", JSON.stringify(user));
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Login Error", error);
      if (error.response?.status === 401) {
        setError("이메일 또는 비밀번호가 일치하지 않습니다.");
      } else {
        setError("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 빠른 체험 버튼 - 관리자 계정
  const handleQuickAdminLogin = async () => {
    setEmpEmail("admin");
    setPassword("admin");
    setError("");
    setLoading(true);

    // 약간의 딜레이로 입력창 채워지는 걸 보여줌
    setTimeout(async () => {
      try {
        const response = await api.post("/v1/emp/login", {
          empEmail: "admin",
          password: "admin"
        });
        if (response.data && response.data.empNum) {
          const user = response.data;
          dispatch({ type: "USER_INFO", payload: user });
          sessionStorage.setItem("user", JSON.stringify(user));
          navigate(from, { replace: true });
        }
      } catch (error) {
        console.error("Admin Login Error", error);
        if (error.response?.status === 401) {
          setError("관리자 계정 로그인에 실패했습니다.");
        } else {
          setError("로그인에 실패했습니다. 다시 시도해주세요.");
        }
        setLoading(false);
      }
    }, 300);
  };

  // 빠른 체험 버튼 - 직원 계정
  const handleQuickTrainerLogin = async () => {
    setEmpEmail("trainer1@gym.com");
    setPassword("12345");
    setError("");
    setLoading(true);

    // 약간의 딜레이로 입력창 채워지는 걸 보여줌
    setTimeout(async () => {
      try {
        const response = await api.post("/v1/emp/login", {
          empEmail: "trainer1@gym.com",
          password: "12345"
        });
        if (response.data && response.data.empNum) {
          const user = response.data;
          dispatch({ type: "USER_INFO", payload: user });
          sessionStorage.setItem("user", JSON.stringify(user));
          navigate(from, { replace: true });
        }
      } catch (error) {
        console.error("Trainer Login Error", error);
        if (error.response?.status === 401) {
          setError("직원 계정 로그인에 실패했습니다.");
        } else {
          setError("로그인에 실패했습니다. 다시 시도해주세요.");
        }
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div className="card shadow-lg border-0" style={{ width: "440px", borderRadius: "15px" }}>
      <div className="card-body p-5">
        <div className="text-center mb-4">
          {/* ⬇ 아이콘을 Navbar 톤(—bs-dark)으로 통일 */}
          <div className="mb-3">
            <HeartbeatLogo stroke="#0a0f1f" />
          </div>
          <h2 className="card-title fw-bold mb-2">GYM ERP</h2>
          <p className="text-muted">관리 시스템</p>
        </div>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button type="button" className="btn-close" onClick={() => setError("")} aria-label="Close"></button>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3 float-field">
            <input
              id="login-email"
              type="text"
              className="input"
              placeholder=" "
              value={empEmail}
              onChange={(e) => setEmpEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="username"
              autoFocus
            />
            <label htmlFor="login-email" className="label">Email</label>
          </div>

          <div className="mb-4 float-field">
            <input
              id="login-password"
              type="password"
              className="input"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
            />
            <label htmlFor="login-password" className="label">Password</label>
          </div>

          {/* 메인 로그인 버튼 */}
          <button
            type="submit"
            className="btn btn-dark w-100 py-3 fw-semibold"
            disabled={loading}
            style={{ borderRadius: "10px" }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                로그인 중...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2" />
                로그인
              </>
            )}
          </button>
        </form>

        {/* 빠른 체험 버튼들 */}
        <div className="mt-4 pt-3 border-top">
          <p className="text-center text-muted small mb-3">빠른 체험(체험하실 계정을 선택해 주세요)</p>
          <div className="d-flex gap-2">
            <button
              onClick={handleQuickAdminLogin}
              className="btn btn-outline-secondary btn-sm flex-fill"
              disabled={loading}
              style={{ fontSize: "0.85rem" }}
            >
              <i className="bi bi-shield-lock me-1"></i>
              관리자 계정
            </button>
            <button
              onClick={handleQuickTrainerLogin}
              className="btn btn-outline-secondary btn-sm flex-fill"
              disabled={loading}
              style={{ fontSize: "0.85rem" }}
            >
              <i className="bi bi-person me-1"></i>
              직원 계정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
