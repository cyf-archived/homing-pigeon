"use client";
import React, { useEffect } from "react";
import { fetchUser } from "@/services";

export default function Login({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  const fetchData = () => {
    fetchUser()
      .then((res) => {
        console.log("res", res);
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="min-h-[calc(100vh-8rem)] w-full max-w-screen-xl flex-1 px-5 xl:px-0">
        <div className="h-[100%] w-full">Login page</div>
      </div>
    </>
  );
}
