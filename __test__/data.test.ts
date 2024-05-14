import { describe, expect, test } from "bun:test";
import { DataProcessor } from "..";

describe("data", () => {
    test("should success", async () => {
        try {
            DataProcessor.init({
                name: "asd",
                phoneNumber: "+84932274306",
                provinceCode: "37",
                province: "Hà Nội",
                email: "dung.pham@thebank.vn",
                serviceCode: "11",
                providerType: "1",
                provider: "fireant",
                device: { os: "android" },
                subProvider: "",
            });
            await DataProcessor.validate();
            const data = await (await DataProcessor.sanitize()).convert();
            expect(data).toEqual({
                name: "asd",
                address: {
                    provinceCode: 37,
                    provinceName: "Hà Nội",
                },
                phoneNumber: "+84932274306",
                email: "dung.pham@thebank.vn",
                serviceCode: 11,
                provider: "fireant",
            });
        } catch (e: any) {
            expect.unreachable(e);
        }
    });

    test("should validate phone failed", async () => {
        try {
            DataProcessor.init({
                name: "asd",
                phoneNumber: "1231234234",
                provinceCode: "37",
                province: "Hà Nội",
                email: "dung.pham@thebank.vn",
                serviceCode: "11",
                providerType: "1",
                provider: "fireant",
                device: { os: "android" },
                subProvider: "",
            });
            await DataProcessor.validate();
        } catch (e: any) {
            expect(e.message).toBe("Số điện thoại không hợp lệ");
        }
    });

    test("should validate phone failed 2", async () => {
        try {
            DataProcessor.init({
                name: "asd",
                provinceCode: "37",
                province: "Hà Nội",
                email: "dung.pham@thebank.vn",
                serviceCode: "11",
                providerType: "1",
                provider: "fireant",
                device: { os: "android" },
                subProvider: "",
            });
            await DataProcessor.validate();
        } catch (e: any) {
            expect(e.message).toBe("Số điện thoại không hợp lệ");
        }
    });

    test("should validate name failed", async () => {
        try {
            DataProcessor.init({
                phoneNumber: "+84932274306",
                provinceCode: "37",
                province: "Hà Nội",
                email: "dung.pham@thebank.vn",
                serviceCode: "11",
                providerType: "1",
                provider: "fireant",
                device: { os: "android" },
                subProvider: "",
            });
            await DataProcessor.validate();
        } catch (e: any) {
            expect(e.message).toBe("Vui lòng nhập họ và tên");
        }
    });

    test("should validate email failed", async () => {
        try {
            DataProcessor.init({
                name: "test",
                phoneNumber: "+84932274306",
                provinceCode: "37",
                province: "Hà Nội",
                email: "dung.pham@thebank",
                serviceCode: "11",
                providerType: "1",
                provider: "fireant",
                device: { os: "android" },
                subProvider: "",
            });
            await DataProcessor.validate();
        } catch (e: any) {
            expect(e.message).toBe("Email không hợp lệ");
        }
    });

    test("should validate email failed 2", async () => {
        try {
            DataProcessor.init({
                name: "test",
                phoneNumber: "+84932274306",
                provinceCode: "37",
                province: "Hà Nội",
                email: "dung.pham",
                serviceCode: "11",
                providerType: "1",
                provider: "fireant",
                device: { os: "android" },
                subProvider: "",
            });
            await DataProcessor.validate();
        } catch (e: any) {
            expect(e.message).toBe("Email không hợp lệ");
        }
    });

    test("should validate email failed 3", async () => {
        try {
            DataProcessor.init({
                name: "test",
                phoneNumber: "+84932274306",
                provinceCode: "37",
                province: "Hà Nội",
                serviceCode: "11",
                providerType: "1",
                provider: "fireant",
                device: { os: "android" },
                subProvider: "",
            });
            await DataProcessor.validate();
        } catch (e: any) {
            expect(e.message).toBe("Email không hợp lệ");
        }
    });

    test("should validate province failed", async () => {
        try {
            DataProcessor.init({
                name: "test",
                email: "dung.pham@thebank.vn",
                phoneNumber: "+84932274306",
                province: "Hà Nội",
                serviceCode: "11",
                providerType: "1",
                provider: "fireant",
                device: { os: "android" },
                subProvider: "",
            });
            await DataProcessor.validate();
        } catch (e: any) {
            expect(e.message).toBe("Vui lòng chọn tỉnh thành");
        }
    });
});
