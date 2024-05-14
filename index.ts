import googleLibphonenumber from "google-libphonenumber";

const phoneUtil = googleLibphonenumber.PhoneNumberUtil.getInstance();

interface Props {
    name: string;
    phoneNumber: string;
    provinceCode: string | number;
    province: string;
    email: string;
    serviceCode: string | number;
    providerType: string | number;
    provider: string;
    device: {
        os: string;
    };
    subProvider?: string;
}

const PROVINCES = [
    { id: "30", name: "An Giang" },
    { id: "10", name: "Bà Rịa Vũng Tàu" },
    { id: "28", name: "Bắc Giang" },
    { id: "62", name: "Bắc Kạn" },
    { id: "55", name: "Bạc Liêu" },
    { id: "17", name: "Bắc Ninh" },
    { id: "37", name: "Bến Tre" },
    { id: "25", name: "Bình Định" },
    { id: "4", name: "Bình Dương" },
    { id: "23", name: "Bình Phước" },
    { id: "13", name: "Bình Thuận  " },
    { id: "39", name: "Cà Mau" },
    { id: "12", name: "Cần Thơ" },
    { id: "63", name: "Cao Bằng" },
    { id: "3", name: "Đà Nẵng" },
    { id: "11", name: "Đắk Lắk" },
    { id: "38", name: "Đắk Nông" },
    { id: "58", name: "Điện Biên" },
    { id: "5", name: "Đồng Nai" },
    { id: "47", name: "Đồng Tháp" },
    { id: "22", name: "Gia Lai" },
    { id: "61", name: "Hà Giang" },
    { id: "45", name: "Hà Nam" },
    { id: "2", name: "Hà Nội" },
    { id: "46", name: "Hà Tĩnh" },
    { id: "21", name: "Hải Dương" },
    { id: "7", name: "Hải Phòng" },
    { id: "53", name: "Hậu Giang" },
    { id: "1", name: "Hồ Chí Minh" },
    { id: "29", name: "Hòa Bình" },
    { id: "24", name: "Hưng Yên" },
    { id: "6", name: "Khánh Hòa" },
    { id: "16", name: "Kiên Giang" },
    { id: "49", name: "Kon Tum" },
    { id: "59", name: "Lai Châu" },
    { id: "14", name: "Lâm Đồng" },
    { id: "60", name: "Lạng Sơn" },
    { id: "34", name: "Lào Cai" },
    { id: "8", name: "Long An" },
    { id: "35", name: "Nam Định" },
    { id: "20", name: "Nghệ An" },
    { id: "41", name: "Ninh Bình" },
    { id: "43", name: "Ninh Thuận" },
    { id: "42", name: "Phú Thọ" },
    { id: "44", name: "Phú Yên" },
    { id: "50", name: "Quảng Bình" },
    { id: "9", name: "Quảng Nam" },
    { id: "36", name: "Quảng Ngãi" },
    { id: "18", name: "Quảng Ninh" },
    { id: "51", name: "Quảng Trị" },
    { id: "48", name: "Sóc Trăng" },
    { id: "54", name: "Sơn La" },
    { id: "32", name: "Tây Ninh" },
    { id: "27", name: "Thái Bình" },
    { id: "33", name: "Thái Nguyên" },
    { id: "19", name: "Thanh Hóa" },
    { id: "15", name: "Thừa Thiên Huế" },
    { id: "26", name: "Tiền Giang" },
    { id: "52", name: "Trà Vinh" },
    { id: "57", name: "Tuyên Quang" },
    { id: "40", name: "Vĩnh Long" },
    { id: "31", name: "Vĩnh Phúc" },
    { id: "56", name: "Yên Bái" },
];

function isValidPhone(phone: string): boolean {
    if (phone.length < 9 && phone.length > 10) {
        return false;
    }

    if (phone.length === 10) {
        const regex = /^089*/;
        return regex.test(phone);
    }

    try {
        const number = phoneUtil.parseAndKeepRawInput(phone, "VN");
        return phoneUtil.isValidNumber(number);
    } catch (error: any) {
        return false;
    }
}

function isValidEmail(email: string): boolean {
    const parts = email.split("@");

    if (parts.length !== 2) {
        return false;
    }

    const [localPart, domainPart] = parts;

    if (localPart.length === 0 || domainPart.length === 0) {
        return false;
    }

    if (domainPart.indexOf(".") === -1) {
        return false;
    }

    return true;
}

export const DataProcessor = {
    data: {} as Props,

    async validate() {
        const data = this.data as Props;

        if (!data.name || data.name.length === 0) {
            throw new Error("Vui lòng nhập họ và tên");
        }

        if (!data.phoneNumber || !isValidPhone(data.phoneNumber)) {
            throw new Error("Số điện thoại không hợp lệ");
        }

        if (!data.email || !isValidEmail(data.email)) {
            throw new Error("Email không hợp lệ");
        }

        if (!data.provinceCode) {
            throw new Error("Vui lòng chọn tỉnh thành");
        }
    },

    async sanitize() {
        if (typeof this.data.provinceCode === "string") {
            this.data.provinceCode = Number.parseInt(this.data.provinceCode);
        }
        if (typeof this.data.serviceCode === "string") {
            this.data.serviceCode = Number.parseInt(this.data.serviceCode);
        }

        if (!this.data.province) {
            this.data.province = PROVINCES.filter((p) => p.id === this.data.provinceCode)[0].name;
        }

        if (!this.data.serviceCode) {
            this.data.serviceCode = 11; // bhnt
        }

        return this;
    },

    async convert() {
        return {
            name: this.data.name,
            address: {
                provinceCode: this.data.provinceCode,
                provinceName: this.data.province,
            },
            phoneNumber: this.data.phoneNumber,
            email: this.data.email,
            serviceCode: this.data.serviceCode,
            provider: this.data.provider,
        };
    },

    init(data: any) {
        this.data = data;
        return this;
    },
};
