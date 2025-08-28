import React, { useEffect, useState } from "react";
import modalImage from "./asset/modalimage.svg";

import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import H1 from "../../typographies/H1";
import { Stack } from "@mui/system";
import {Grid, Tooltip, Typography} from "@mui/material";
import DeliveryInfo from "../DeliveryInfo";
import Billing from "../Billing";
import PaymentMethod from "../PaymentMethod";
import useGetDistance from "../../../api-manage/hooks/react-query/google-api/useGetDistance";
import { useDispatch, useSelector } from "react-redux";
import { useOrderPlace } from "api-manage/hooks/react-query/order-place/useOrderPlace";
import toast from "react-hot-toast";
import { t } from "i18next";
import { baseUrl } from "api-manage/MainApi";
import Router, { useRouter } from "next/router";
import useGetZoneId from "../../../api-manage/hooks/react-query/google-api/useGetZone";
import {getDeliveryFeeByBadWeather, handleDistance} from "utils/CustomFunctions";
import useGetVehicleCharge from "../../../api-manage/hooks/react-query/order-place/useGetVehicleCharge";
import CustomModal from "../../modal";
import CustomImageContainer from "../../CustomImageContainer";
import { useTheme } from "@emotion/react";
import { PrimaryButton } from "../../Map/map.style";
import TrackParcelOrderDrawer from "../../home/module-wise-components/parcel/TrackParcelOrderDrawer";
import { getGuestId, getToken } from "helper-functions/getToken";
import OfflineForm from "../item-checkout/offline-payment/OfflineForm";
import useGetOfflinePaymentOptions from "../../../api-manage/hooks/react-query/offlinePayment/useGetOfflinePaymentOptions";
import {
  setOfflineInfoStep,
  setOrderDetailsModal,
} from "redux/slices/offlinePaymentData";
import { useOfflinePayment } from "api-manage/hooks/react-query/offlinePayment/useOfflinePayment";
import { DeliveryCaption } from "../CheckOut.style";
import {
  getAmountWithSign,
  getReferDiscount,
} from "helper-functions/CardHelpers";
import CustomDivider from "../../CustomDivider";
import useGetDeliveryInstruction from "../../../api-manage/hooks/react-query/order-place/useGetDeliveryInstruction";
import {
  setOrderDetailsModalOpen,
  setOrderInformation,
} from "redux/slices/utils";
import { setGuestUserOrderId } from "redux/slices/guestUserInfo";
import { useFormik } from "formik";
import * as Yup from "yup";
import {useGetTax} from "api-manage/hooks/react-query/order-place/useGetTax";
import deliveryFree from "components/checkout/DeliveryFree";
import {onErrorResponse} from "api-manage/api-error-response/ErrorResponses";
import {useGetSurgePrice} from "api-manage/hooks/react-query/order-place/useGetSurgePrice";
import InfoIcon from "@mui/icons-material/Info";

const ParcelCheckout = () => {
  const theme = useTheme();
  const { configData } = useSelector((state) => state.configData);
  const { parcelInfo } = useSelector((state) => state.parcelInfoData);
  const { profileInfo } = useSelector((state) => state.profileInfo);

  const { offlineInfoStep, offlinePaymentInfo } = useSelector(
    (state) => state.offlinePayment
  );
  const { parcelCategories } = useSelector((state) => state.parcelCategories);
  const [address, setAddress] = useState(undefined);
  const [deliveryTip, setDeliveryTip] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [paidBy, setPaidBy] = useState("sender");
  const [orderId, setOrderId] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { method } = router.query;
  const [offlineCheck, setOfflineCheck] = useState(false);
  const [zoneIdEnabled, setZoneIdEnabled] = useState(true);
  const [currentZoneId, setCurrentZoneId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [customerInstruction, setCustomerInstruction] = useState(null);
  const [check, setCheck] = React.useState(null);
  const receiverLoacation = {
    lat: parcelInfo?.senderLocations?.lat,
    lng: parcelInfo?.senderLocations?.lng,
  };
  const { data: zoneData } = useGetZoneId(receiverLoacation, zoneIdEnabled);
  const { data, refetch } = useGetDistance(
    parcelInfo?.senderLocations,
    parcelInfo?.receiverLocations
  );
  const {data:surgePrice,mutate:surgeMutate}=useGetSurgePrice()
  const token = getToken();
  const guest_id = getGuestId();
  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required(t("Password is required"))
        .min(8, t("Password is too short - should be 8 chars minimum.")),
      confirm_password: Yup.string()
        .required(t("Confirm Password"))
        .oneOf([Yup.ref("password"), null], t("Passwords must match")),
    }),
  });
  const passwordHandler = (value) => {
    formik.setFieldValue("password", value);
  };
  const confirmPasswordHandler = (value) => {
    formik.setFieldValue("confirm_password", value);
  };
  const tempDistance = handleDistance(
    data,
    {
      latitude: parcelInfo?.receiverLocations?.latitude,
      longitude: parcelInfo?.receiverLocations?.longitude,
    },
    address
  );
  const {
    data: offlinePaymentOptions,
    refetch: refetchOfflinePaymentOptions,
    isLoading: offlineIsLoading,
  } = useGetOfflinePaymentOptions();
  useEffect(() => {
    refetchOfflinePaymentOptions();
  }, []);
  const { mutate: offlineMutate, isLoading: offlinePaymentLoading } =
    useOfflinePayment();
  const {
    data: extraCharge,
    isLoading: extraChargeLoading,
    refetch: extraChargeRefetch,
  } = useGetVehicleCharge({ tempDistance });
  const {
    data: deliveryInstruction,
    isLoading: deliveryInstructionIsLoading,
    refetch: deliveryInstructionRefetch,
  } = useGetDeliveryInstruction();
  useEffect(() => {
    if (data) {
      extraChargeRefetch();
    }
  }, [data]);
  useEffect(() => {
    refetch();
  }, [parcelInfo]);
  useEffect(() => {
    deliveryInstructionRefetch();
  }, []);

  useEffect(() => {
    const currentLatLng = JSON.parse(localStorage.getItem("currentLatLng"));
    const location = localStorage.getItem("location");
    const zoneId = JSON.parse(localStorage.getItem("zoneid"));
    setCurrentZoneId(zoneId?.[0]);
    setAddress({
      ...currentLatLng,
      latitude: currentLatLng?.lat,
      longitude: currentLatLng?.lng,
      address: parcelInfo?.senderAddress,
      address_type: "Selected Address",
    });
  }, []);
  const handleOffineOrder = () => {
    const offlinePaymentData = {
      ...offlinePaymentInfo,
      order_id: orderId,
      guest_id: getGuestId(),
    };
    dispatch(setOfflineInfoStep(3));
    dispatch(setOrderDetailsModal(true));
    offlineMutate(offlinePaymentData);
  };
  const zoneId = JSON.parse(localStorage.getItem("zoneid"));
  useEffect(() => {

    if(parcelCategories && zoneId){

      const temData={
        zone_id: zoneId?.[0],
        module_id: parcelCategories?.module_id,
        date_time: new Date().toISOString(),
        guest_id:getGuestId()
      }
      surgeMutate(temData,{
        onError:onErrorResponse
      })
    }

  }, [parcelCategories]);
  useEffect(() => {
    if (offlineCheck) {
      handleOffineOrder();
    }
  }, [orderId]);
  const parcelDeliveryFree = () => {
    let convertedDistance = handleDistance(
      data,
      parcelInfo?.senderLocations,
      parcelInfo?.receiverLocations
    );
    if (
      parcelCategories?.parcel_per_km_shipping_charge === 0 ||
      parcelCategories?.parcel_per_km_shipping_charge > 0
    ) {
      let deliveryFee =
        convertedDistance * parcelCategories?.parcel_per_km_shipping_charge;
      if (deliveryFee > parcelCategories?.parcel_minimum_shipping_charge) {
        return getDeliveryFeeByBadWeather(deliveryFee + extraCharge,surgePrice);
      } else {
        return getDeliveryFeeByBadWeather(parcelCategories?.parcel_minimum_shipping_charge + extraCharge,surgePrice);
      }
    } else {
      let deliveryFee =
        convertedDistance * configData?.parcel_per_km_shipping_charge;
      if (deliveryFee > configData?.parcel_minimum_shipping_charge) {
        return getDeliveryFeeByBadWeather(deliveryFee + extraCharge,surgePrice);
      } else {
        return getDeliveryFeeByBadWeather(configData?.parcel_minimum_shipping_charge + extraCharge,surgePrice);
      }
    }
  };
  const receiverDetails = JSON.stringify({
    id: null,
    address_type: "others",
    contact_person_number: `+${parcelInfo?.receiverPhone}`,
    contact_person_email: parcelInfo?.receiverEmail,
    address: parcelInfo?.receiverAddress,
    additional_address: null,
    latitude: parcelInfo?.receiverLocations?.lat,
    longitude: parcelInfo?.receiverLocations?.lng,
    zone_id: zoneData?.zone_data[0]?.id,
    zone_ids: null,
    _method: null,
    contact_person_name: parcelInfo?.receiverName,
    road: parcelInfo?.road,
    house: parcelInfo?.house,
    floor: parcelInfo?.floor,
  });
  const isDigital =
    paymentMethod !== "cash_on_delivery" &&
    paymentMethod !== "wallet" &&
    paymentMethod !== "offline_payment" &&
    paymentMethod !== null
      ? "digital_payment"
      : paymentMethod;
  const orderMutationObject = {
    ...address,
    cart: [],
    order_amount: parcelDeliveryFree() + Number(deliveryTip),
    order_type: "parcel",
    payment_method: isDigital,
    distance:tempDistance,
    discount_amount: 0,
    tax_amount: 0,
    receiver_details: receiverDetails,
    parcel_category_id: parcelCategories?.id,
    charge_payer: paidBy,
    dm_tips: deliveryTip,
    guest_id: getGuestId(),
    contact_person_name: parcelInfo?.senderName,
    contact_person_number: `+${parcelInfo?.senderPhone}`,
    delivery_instruction: customerInstruction,
    sender_zone_id: currentZoneId,
    contact_person_email: parcelInfo?.senderEmail,
    create_new_user: check ? 1 : 0,
    password: formik.values.password,
    is_guest: token ? 0 : 1,
    road: parcelInfo?.senderRoad,
    house: parcelInfo?.senderHouse,
    floor: parcelInfo?.senderFloor,
  };

  const { data: order, isLoading, mutate: orderMutation } = useOrderPlace();
  const {data:taxData,mutate}=useGetTax()

  useEffect(() => {
    if(parcelDeliveryFree()){
      const newOrderObject = {
        ...orderMutationObject,
        order_amount: parcelDeliveryFree(),
      };
      mutate(newOrderObject,{
        onError:onErrorResponse
      })
    }
  }, [parcelDeliveryFree()]);

  const orderPlace = () => {
    if (paidBy === "sender") {
      const handleSuccess = (res) => {
        if (res) {
          if (token) {
            dispatch(setOrderDetailsModal(true));
          } else {
            dispatch(setGuestUserOrderId(res?.order_id));
            dispatch(setOrderInformation(res));
            dispatch(setOrderDetailsModalOpen(true));
          }
          if (
            paymentMethod !== "cash_on_delivery" &&
            paymentMethod !== "offline_payment" &&
            paymentMethod !== "" && paymentMethod !== "wallet"
          ) {
            const payment_platform = "web";
            const page = "my-orders";
            localStorage.setItem("totalAmount", res?.total_ammount);
            const callBackUrl = token
              ? `${window.location.origin}/profile?page=${page}`
              : `${window.location.origin}/home`;
            const url = `${baseUrl}/payment-mobile?order_id=${
              res?.order_id
            }&customer_id=${
              profileInfo?.id ?? res?.user_id ? res?.user_id : guest_id
            }&payment_platform=${payment_platform}&callback=${callBackUrl}&payment_method=${paymentMethod}`;
            router.push(url, undefined, { shallow: true });
          } else if (paymentMethod === "wallet") {
            if (
              Number(profileInfo?.wallet_balance) < Number(parcelDeliveryFree())
            ) {
              toast.error(t("Wallet balance is below total amount."), {
                id: "wallet",
                position: "bottom-right",
              });
            } else {
              toast.success(res?.message);
              //setOpenModal(true);
              Router.push(
                {
                  pathname: "/profile",
                  query: {
                    orderId: res?.order_id,
                    page: "my-orders",
                    from: "checkout",
                  },
                },
                undefined,
                { shallow: true }
              );
            }
          } else if (paymentMethod === "offline_payment") {
            setOrderId(res?.order_id);
            dispatch(setOrderInformation(res));
            setOfflineCheck(true);
            toast.success(res?.message);
            if (!token) {
              Router.push(
                {
                  pathname: "/home",
                  query: { order_id: res?.order_id },
                },
                undefined,
                { shallow: true }
              );
            } else {
              Router.push(
                {
                  pathname: "/profile",
                  query: {
                    orderId: res?.order_id,
                    page: "my-orders",
                    from: "checkout",
                  },
                },
                undefined,
                { shallow: true }
              );
            }
          } else {
            toast.success(res?.message);
            const token = getToken();
            if (!token) {
              Router.push(
                {
                  pathname: "/home",
                  query: { order_id: res?.order_id },
                },
                undefined,
                { shallow: true }
              );
            } else {
              Router.push(
                {
                  pathname: "/profile",
                  query: {
                    orderId: res?.order_id,
                    page: "my-orders",
                    from: "checkout",
                  },
                },
                undefined,
                { shallow: true }
              );
            }
            setOrderId(res?.order_id);
            //setOpenModal(true);
          }
        }
      };

      orderMutation(orderMutationObject, {
        onSuccess: handleSuccess,
        onError: (error) => {
          error?.response?.data?.errors?.forEach((item) =>
            toast.error(item.message, {
              position: "bottom-right",
            })
          );
        },
      });
    } else {
      dispatch(setOrderDetailsModalOpen(true));
      if (paymentMethod === "cash_on_delivery") {
        const handleSuccess = (res) => {
          if (res) {
            if (paymentMethod === "digital_payment") {
              localStorage.setItem("totalAmount", res?.total_ammount);
              const newBaseUrl = baseUrl.substring(0, 31);
              const callBackUrl = `${window.location.origin}/order?order_id=${res?.order_id}&total=${res?.total_ammount}`;
              const url = `${newBaseUrl}/payment-mobile?order_id=${res?.order_id}&customer_id=${profileInfo?.id}&callback=${callBackUrl}`;
              router.push(url, undefined, { shallow: true });
            } else if (paymentMethod === "wallet") {
              if (
                Number(profileInfo?.wallet_balance) <
                Number(parcelDeliveryFree())
              ) {
                toast.error(t("Wallet balance is below total amount."), {
                  id: "wallet",
                  position: "bottom-right",
                });
              } else {
                toast.success(res?.message);
                //setOpenModal(true);
                const token = getToken();
                if (!token) {
                  Router.push(
                    {
                      pathname: "/home",
                      query: { order_id: res?.order_id },
                    },
                    undefined,
                    { shallow: true }
                  );
                } else {
                  Router.push(
                    {
                      pathname: "/profile",
                      query: {
                        orderId: res?.order_id,
                        page: "my-orders",
                        from: "checkout",
                      },
                    },
                    undefined,
                    { shallow: true }
                  );
                }
              }
            } else {
              toast.success(res?.message);
              const token = getToken();
              if (!token) {
                Router.push(
                  {
                    pathname: "/home",
                    query: { order_id: res?.order_id },
                  },
                  undefined,
                  { shallow: true }
                );
              } else {
                Router.push(
                  {
                    pathname: "/profile",
                    query: {
                      orderId: res?.order_id,
                      page: "my-orders",
                      from: "checkout",
                    },
                  },
                  undefined,
                  { shallow: true }
                );
              }
              setOrderId(res?.order_id);
              //setOpenModal(true);
            }
          }
        };

        orderMutation(orderMutationObject, {
          onSuccess: handleSuccess,
          onError: (error) => {
            error?.response?.data?.errors?.forEach((item) =>
              toast.error(item.message, {
                position: "bottom-right",
              })
            );
          },
        });
      } else {
        toast.error(
          t("Without any payment method, you can not place the order.")
        );
      }
    }
  };
  const handleClick = () => {
    setSideDrawerOpen(true);
  };
  const finalTotal = profileInfo?.is_valid_for_discount
    ? parcelDeliveryFree() +
      Number(deliveryTip) +
      (configData?.additional_charge ? configData?.additional_charge : 0) -
      getReferDiscount(
        parcelDeliveryFree(),
        profileInfo?.discount_amount,
        profileInfo?.discount_amount_type
      )
    : parcelDeliveryFree() +
      Number(deliveryTip) +
      (configData?.additional_charge ? configData?.additional_charge : 0);

  const getParcelPayment = () => {
    // Check if zoneData and zone_data are available
    if (!zoneData?.zone_data) return [];

    // Filter the items where module_type is "parcel"
    return zoneData.zone_data.filter((item) =>
      item?.modules?.find((module) => module?.module_type === "parcel")
    );
  };
  const extraText = t("This charge includes extra vehicle charge");
  const deliveryToolTipsText = `${extraText} ${getAmountWithSign(
    extraCharge
  )}${
    surgePrice?.customer_note_status !== 0
      ? ` ${surgePrice?.customer_note} ${
        surgePrice?.type === "amount"
          ? getAmountWithSign(surgePrice?.price)
          : `${surgePrice?.price}%`
      }`
      : ""
  }`;
  return (
    <>
      {method === "offline" ? (
        <CustomStackFullWidth
          paddingBottom={{ sm: "20px", md: "80px" }}
          pt="1.5rem"
          alignItems="center"
        >
          <CustomPaperBigCard
            sx={{ width: { xs: "100%", sm: "90%", md: "80%" } }}
          >
            <OfflineForm
              offlinePaymentOptions={offlinePaymentOptions}
              total_order_amount={
                parcelDeliveryFree() +
                parseFloat(deliveryTip) +
                configData?.additional_charge
              }
              placeOrder={orderPlace}
              offlinePaymentLoading={offlinePaymentLoading || isLoading}
            />
          </CustomPaperBigCard>
        </CustomStackFullWidth>
      ) : (
        <CustomStackFullWidth
          paddingBottom={{ sm: "20px", md: "80px" }}
          pt="1.5rem"
        >
          <Stack paddingBottom="20px">
            <H1 text="Checkout" textAlign="left" />
          </Stack>
          <CustomStackFullWidth>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={12} md={4}>
                <DeliveryInfo
                  configData={configData}
                  parcelInfo={parcelInfo}
                  parcelCategories={parcelCategories}
                  deliveryInstruction={deliveryInstruction}
                  customerInstruction={customerInstruction}
                  setCustomerInstruction={setCustomerInstruction}
                  check={check}
                  setCheck={setCheck}
                  formik={formik}
                  passwordHandler={passwordHandler}
                  confirmPasswordHandler={confirmPasswordHandler}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <Billing
                  deliveryTip={deliveryTip}
                  setDeliveryTip={setDeliveryTip}
                  paidBy={paidBy}
                  setPaidBy={setPaidBy}
                  data={data}
                  parcelDeliveryFree={parcelDeliveryFree}
                  zoneData={{ data: zoneData }}
                  senderLocation={parcelInfo?.senderLocations}
                  receiverLocation={parcelInfo?.receiverLocations}
                  configData={configData}
                  extraChargeLoading={extraChargeLoading}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                {currentZoneId && zoneData && (
                  <CustomPaperBigCard padding="20px">
                    <DeliveryCaption parcel="true">
                      {t("Order Summary")}
                    </DeliveryCaption>
                    <CustomStackFullWidth spacing={1} paddingY="10px">
                      <Stack direction="row" justifyContent="space-between">
                        <Typography fontWeight="500">
                          {t("Delivery Fee")}
                          {extraCharge>0|| surgePrice?.price>0 ? (<Tooltip
                            title={deliveryToolTipsText}
                            placement="top"
                            arrow={true}
                          >
                            <InfoIcon sx={{ fontSize: "11px" }} />
                          </Tooltip>):null}

                        </Typography>
                        <Typography fontWeight="500">
                          {getAmountWithSign(parcelDeliveryFree())}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography fontWeight="500">
                          {t("Delivery Man Tips")}
                        </Typography>
                        <Typography fontWeight="500">
                          {getAmountWithSign(deliveryTip)}
                        </Typography>
                      </Stack>
                      {
                        taxData?.tax_included!==null && taxData?.tax_included === 0 ? (
                          <>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography fontWeight="500">
                                {t("VAT/TAX")}
                              </Typography>
                              <Typography fontWeight="500">
                                {taxData?.tax_included === 0 && <>{"(+)"}</>}
                                {getAmountWithSign(taxData?.tax_amount)}
                              </Typography>
                            </Stack>
                          </>
                        ) : null
                      }
                      {configData?.additional_charge_status === 1 && (
                        <Stack direction="row" justifyContent="space-between">
                          <Typography fontWeight="500">
                            {configData?.additional_charge_name}
                          </Typography>
                          <Typography fontWeight="500">
                            {getAmountWithSign(configData?.additional_charge)}
                          </Typography>
                        </Stack>
                      )}

                      <CustomDivider border="1px" />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography fontWeight="500" color="primary" component="span">
                          {t("Total") }
                          {taxData?.tax_included === 1 && taxData?.tax_included!==null && (
                            <Typography fontSize="12px" sx={{marginInlineStart:"5px"}} color="primary" component="span">
                              { ("(Vat/Tax incl.)")}
                            </Typography>
                          )}

                        </Typography>
                        <Typography fontWeight="500" color="primary">
                          {getAmountWithSign(
                            parcelDeliveryFree() +
                              Number(deliveryTip) + taxData?.tax_amount+
                              (configData?.additional_charge
                                ? configData?.additional_charge
                                : 0 )
                          )}

                        </Typography>
                      </Stack>
                    </CustomStackFullWidth>
                    <PaymentMethod
                      setPaymentMethod={setPaymentMethod}
                      paymentMethod={paymentMethod}
                      paidBy={paidBy}
                      isLoading={isLoading}
                      orderPlace={orderPlace}
                      zoneData={{ data: zoneData }}
                      configData={configData}
                      storeZoneId={currentZoneId}
                      parcel="true"
                      offlinePaymentOptions={offlinePaymentOptions}
                      getParcelPayment={getParcelPayment}
                    />
                  </CustomPaperBigCard>
                )}
              </Grid>
            </Grid>
          </CustomStackFullWidth>
          {openModal && (
            <CustomModal
              openModal={openModal}
              handleClose={() => setOpenModal(false)}
            >
              <CustomPaperBigCard>
                <CustomStackFullWidth
                  justifyContent="center"
                  spacing={2}
                  alignItem="center"
                >
                  <CustomImageContainer src={modalImage.src} />
                  <Typography
                    textAlign="center"
                    color={theme.palette.primary.main}
                    fontSize="20px"
                    fontWeight="700"
                  >
                    {t("Congratulations!")}
                  </Typography>
                  <Typography
                    textAlign="center"
                    maxWidth="400px"
                    color={theme.palette.neutral[400]}
                  >
                    {t(
                      "Your parcel request submitted successfully! to check your parcel status please track order."
                    )}
                  </Typography>
                  <PrimaryButton onClick={handleClick}>
                    {t("Track Order")}
                  </PrimaryButton>
                </CustomStackFullWidth>
              </CustomPaperBigCard>
            </CustomModal>
          )}
          {sideDrawerOpen && (
            <TrackParcelOrderDrawer
              orderId={orderId}
              sideDrawerOpen={sideDrawerOpen}
              setSideDrawerOpen={setSideDrawerOpen}
            />
          )}
        </CustomStackFullWidth>
      )}
    </>
  );
};

export default ParcelCheckout;
