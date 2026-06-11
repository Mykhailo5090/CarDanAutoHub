import React from "react";

const OffersGrid = ({ result, plate, setStep, setSelectedPkg }) => {
  const packages = result?.offers || result?.packages || [];
  const vehicleData = result?.vehicle;

  const vehicleModel = vehicleData?.model || "";
  const vehicleType = vehicleData?.type || "";
  const vehicleYear = vehicleData?.year || "";

  return (
    <>
      {/* ЛІВИЙ БЛОК: ІНФОРМАЦІЯ ПРО АВТОМОБІЛЬ */}
      <div className="container_profile container_profile_1 insurance_left_panel">
        <div className="user-info-card __shadows insurance_car_info_card">
          <div className="container_userpage_sub container_userpage_sub_1 insurance_car_details_wrapper">
            <div className="container_button_insurance-page">
              <button
                onClick={() => setStep(1)}
                className="bulk-btn insurance_back_btn"
              >
                ← Back
              </button>
            </div>

            <div className="profile-fields insurance_car_specs">
              <p className="insurance_car_title">
                <strong>{vehicleModel || "Автомобіль"}</strong>
              </p>
              {vehicleType && (
                <p className="p_strong_profilepage ">
                  <strong>Type: </strong> {vehicleType}
                </p>
              )}
              {vehicleYear && (
                <p p_strong_profilepage>
                  <strong>Year: </strong> {vehicleYear} y.
                </p>
              )}
              <p p_strong_profilepage>
                <strong>Gov. Plate: </strong> {plate}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ПРАВИЙ БЛОК: СІТКА СТРАХОВИХ ПРОПОЗИЦІЙ */}
      <div className="container_profile container_profile_2 insurance_right_panel">
        <div className="user-cars-section container_profile_1 insurance_offers_section">
          <div className="__shadows insurance_header_shadow">
            <p className="p_buypage_filtration __paddings_buypage">
              Available insurance policies:
            </p>
          </div>

          {packages.length === 0 ? (
            <div className="cars-list-container __shadows insurance_error_container">
              <p className="p_strong_profilepage insurance_error_title">
                ⚠️ Wrong number or 0 insurance offers
              </p>
              <p className="insurance_error_text">
                Бот відпрацював, але масив пропозицій порожній.
              </p>
              <pre className="insurance_diagnostic_pre">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="cars-list-container __shadows insurance_offers_grid_list">
              {packages.map((pkg, index) => (
                <div
                  key={pkg.id || index}
                  className="user-car-row __shadows_mini insurance_offer_row"
                >
                  {pkg.logo && (
                    <img
                      src={pkg.logo}
                      alt={pkg.name}
                      className="user-car-img insurance_company_logo"
                    />
                  )}

                  <div className="user-car-info insurance_offer_meta">
                    <p className="p_strong_profilepage insurance_company_name">
                      {pkg.name || pkg.company}
                    </p>
                    <p className="p_strong_profilepage insurance_franchise_text">
                      Franchise: <strong>{pkg.franchise}</strong>
                    </p>
                    <p className="p_strong_profilepage insurance_price_text">
                      {pkg.price} <strong>грн</strong>
                    </p>
                  </div>

                  <div className="insurance_action_wrapper">
                    <button
                      className="bulk-btn bulk-btn_userpage btn-save-profile insurance_select_pkg_btn"
                      onClick={() => {
                        setSelectedPkg(pkg);
                        setStep(3);
                      }}
                    >
                      Choose
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OffersGrid;
