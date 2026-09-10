import React, { createContext, useContext, useState, useEffect } from 'react';

export const LANGUAGES = [
  { code: 'ta', label: 'தமிழ்', name: 'Tamil', flag: '🇮🇳' },
  { code: 'en', label: 'English', name: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी', name: 'Hindi', flag: '🇮🇳' },
  { code: 'te', label: 'తెలుగు', name: 'Telugu', flag: '🇮🇳' },
  { code: 'kn', label: 'ಕನ್ನಡ', name: 'Kannada', flag: '🇮🇳' },
  { code: 'ml', label: 'മലയാളം', name: 'Malayalam', flag: '🇮🇳' }
];

export const TRANSLATIONS = {
  // 1. TAMIL (தமிழ்)
  ta: {
    // Header & Navigation
    homepot_chef: 'ஹோம்பாட் செஃப்',
    kitchen_open: 'சமையலறை திறந்துள்ளது',
    kitchen_closed: 'சமையலறை மூடப்பட்டுள்ளது',
    tap_to_change: 'மாற்ற தொடவும்',
    live_orders: 'நேரடி ஆர்டர்கள்',
    menu: 'உணவு மெனு',
    bankings: 'வங்கி கணக்கு',
    profile: 'சுயவிவரம்',
    notifications: 'அறிவிப்புகள்',
    help_support: 'உதவி & ஆதரவு',
    settings: 'அமைப்புகள்',
    choose_language: 'மொழியை மாற்றுக',

    // Onboarding / Login / Signup
    chef_portal: 'அம்மாக்கள் & இல்லத்தரசிகள் சமையல் தளம்',
    authentic_tagline: 'வீட்டு சுவையில் பாசத்துடன் தயாராகும் உணவுகள்',
    sign_in: 'செஃப் உள்நுழைவு',
    sign_up: 'புதிய செஃப் பதிவு',
    email_address: 'மின்னஞ்சல் முகவரி',
    password: 'கடவுச்சொல்',
    mobile_number: 'கைபேசி எண்',
    send_otp: 'சரிபார்ப்பு குறியீடு அனுப்பவும் (OTP)',
    enter_otp: '4 இலக்க குறியீட்டை உள்ளிடவும்',
    verify_proceed: 'குறியீட்டை சரிபார்த்து தொடரவும்',
    resend_code: 'மறுபடி குறியீடு அனுப்பு',
    already_chef: 'ஏற்கனவே பதிந்துள்ளீர்களா? உள்நுழையவும்',
    new_chef_prompt: 'புதிய சமையல் கலைஞரா? இன்றே தொடங்குங்கள்',

    // Kitchen Registration (Step 2)
    register_kitchen: 'சமையலறை பதிவு',
    step_2_title: 'படி 2 / 3 • சமையலறை & சுகாதாரம்',
    amma_chef_photo: 'அம்மா / சமையல் கலைஞர் புகைப்படம்',
    kitchen_name: 'சமையலறை பெயர்',
    kitchen_name_placeholder: 'உதா., அம்மா சமையல் கூடம்',
    owner_full_name: 'உரிமையாளர் முழு பெயர்',
    owner_name_placeholder: 'உங்கள் பெயரை உள்ளிடவும்',
    fssai_title: 'FSSAI பதிவு / உணவு பாதுகாப்பு சான்றிதழ்',
    fssai_placeholder: '14 இலக்க FSSAI எண்',
    fssai_verified: 'அரசு API சரிபார்க்கப்பட்டது',
    fssai_verifying: 'FoSCoS அரசு தளத்துடன் இணைகிறது...',
    kitchen_address: 'சமையலறை முகவரி & இடம்',
    kitchen_address_placeholder: 'கதவு எண், தெரு பெயர், பகுதி, ஊர்',
    privacy_shield: 'செஃப் பாதுகாப்பு: முகவரி வாடிக்கையாளருக்கு உணவு எடுக்கும் நேரத்தில் மட்டுமே காட்டப்படும்.',
    cuisine_specialties: 'சமையல் வகைகள் (பொருந்துவதை தேர்வு செய்யவும்)',
    pure_veg: 'சுத்த சைவ உணவு',
    south_indian: 'தென்னிந்திய உணவு',
    north_indian: 'வடஇந்திய உணவு',
    home_sweets: 'வீட்டு இனிப்பு & பலகாரங்கள்',
    andhra_style: 'ஆந்திரா காரசார உணவு',
    safety_declaration_title: 'உணவு பாதுகாப்பு & நியாய விலை உறுதிமொழி:',
    safety_declaration_desc: 'வீட்டு சமையலறையில் சுத்தமாகவும், ஆரோக்கியமான முறையிலும், நியாயமான விலையிலும் உணவு தயாரித்து வழங்குவேன் என உறுதியளிக்கிறேன்.',
    continue_to_banking: 'வங்கி விவரங்களுக்கு செல்லவும்',

    // Banking Setup (Step 3)
    banking_title: 'வங்கி கணக்கு & பணப்பட்டுவாடா',
    step_3_title: 'படி 3 / 3 • வாராந்திர நேரடி பணப்பட்டுவாடா',
    account_holder: 'கணக்கு வைத்திருப்பவர் பெயர்',
    account_holder_placeholder: 'வங்கி பாஸ்புக்கில் உள்ளபடி பெயர்',
    bank_name: 'வங்கி பெயர்',
    bank_name_placeholder: 'உதா., இந்தியன் வங்கி, SBI, HDFC',
    account_number: 'வங்கி கணக்கு எண்',
    ifsc_code: 'IFSC குறியீடு',
    upi_id: 'UPI முகவரி (விரைவு பரிவர்த்தனைக்கு)',
    upi_placeholder: 'உதா., peyar@okaxis',
    direct_payout_title: '100% நேரடி பணப்பட்டுவாடா உத்தரவாதம்',
    direct_payout_desc: 'உங்கள் வாராந்திர உழைப்பின் வருமானம் நேரடியாக உங்கள் வங்கிக் கணக்கில் எந்த கமிஷன் பிடித்தமும் இன்றி வந்து சேரும்.',
    open_kitchen_btn: 'சமையலறையை திறந்து ஆர்டர்களை தொடங்கவும்',
    back_to_kitchen_btn: 'சமையலறை விவரங்களுக்கு திரும்பவும்',

    // Menu & Daily Hygiene
    daily_hygiene_required: 'இன்றைய சமையலறை புகைப்படம் தேவை',
    daily_hygiene_desc: 'ஆர்டர்கள் தொடங்கும் முன், உங்கள் சுத்தமான சமையல் மேடையை கேமராவில் படம் எடுத்து பகிரவும்.',
    daily_hygiene_verified: 'இன்றைய சமையலறை சுகாதாரம் சரிபார்க்கப்பட்டது',
    daily_hygiene_verified_desc: 'இன்று நேரடி கேமராவில் படம் எடுக்கப்பட்டது. வாடிக்கையாளர்கள் இதை பார்க்க முடியும்!',
    open_camera_btn: 'கேமராவை திறந்து படம் எடுக்கவும்',
    retake_camera_btn: 'மீண்டும் கேமரா படம் எடுக்கவும்',
    direct_camera_btn: 'நேரடி கேமரா',
    live_view: 'நேரடி பார்வை',
    point_camera_tip: 'கேமராவை சுத்தமான சமையல் மேடையை நோக்கி வைத்து பட்டனை அழுத்தவும்.',

    menu_portions_title: 'சமையலறை மெனு & அளவுகள்',
    menu_portions_subtitle: 'உணவை சேர்க்கவும், மாற்றவும், அளவுகளை சரிசெய்யவும்',
    add_dish_btn: '+ உணவு சேர்க்க',
    portions_label: 'அளவுகள்:',
    edit_btn: 'திருத்து',
    mark_sold_out: 'தீர்ந்துவிட்டது என குறிக்கவும்',
    mark_available: 'உள்ளது என குறிக்கவும்',
    available_badge: 'உள்ளது',
    sold_out_badge: 'தீர்ந்துவிட்டது',
    add_signature_dish: 'சிறப்பு வீட்டு உணவை சேர்க்க',
    edit_dish_title: 'உணவு விவரங்களை திருத்தவும்',
    dish_photo_optional: 'உணவு புகைப்படம் (விருப்பப்பட்டால்)',
    upload_photo: 'படம் பதிவேற்ற',
    change_photo: 'படம் மாற்ற',
    remove_photo: 'நீக்கு',
    dish_name_label: 'உணவின் பெயர்',
    dish_name_placeholder: 'உதா., நெய் மசால் தோசை / சாம்பார் சாதம்',
    meal_slot_label: 'உணவு நேரம்',
    breakfast: 'காலை உணவு',
    lunch: 'மதிய உணவு',
    dinner: 'இரவு உணவு',
    snacks: 'மாலை பலகாரங்கள் & இனிப்பு',
    food_type_label: 'உணவு வகை',
    price_per_plate: 'ஒரு தட்டு விலை (₹)',
    daily_portions_label: 'இன்றைய அளவுகள் (எண்ணிக்கை)',
    description_label: 'உணவு விளக்கம் & மூலப்பொருட்கள்',
    description_placeholder: 'வீட்டு முறையில் தயாராகும் மூலப்பொருட்களை விவரிக்கவும்...',
    save_dish_btn: 'சேமித்து மெனுவில் சேர்க்க',
    update_dish_btn: 'மாற்றங்களை சேமிக்கவும்',
    empty_menu_title: 'உங்கள் மெனு காலியாக உள்ளது.',
    empty_menu_desc: 'மேலே உள்ள "+ உணவு சேர்க்க" பட்டனை அழுத்தி உங்கள் முதல் உணவை சேர்க்கவும்!'
  },

  // 2. ENGLISH (en)
  en: {
    homepot_chef: 'HomePot Chef',
    kitchen_open: 'Kitchen OPEN',
    kitchen_closed: 'Kitchen CLOSED',
    tap_to_change: 'Tap to switch',
    live_orders: 'Live Orders',
    menu: 'Menu',
    bankings: 'Bankings',
    profile: 'Profile',
    notifications: 'Notifications',
    help_support: 'Help & Support',
    settings: 'Settings',
    choose_language: 'Change Language',

    chef_portal: 'HomePot Chef Portal',
    authentic_tagline: 'Authentic Home-Cooked Food by Homemakers',
    sign_in: 'Chef Sign In',
    sign_up: 'New Chef Sign Up',
    email_address: 'Email Address',
    password: 'Password',
    mobile_number: 'Mobile Number',
    send_otp: 'Send Verification Code (OTP)',
    enter_otp: 'Enter 4-Digit Code',
    verify_proceed: 'Verify & Proceed to Kitchen Details',
    resend_code: 'Resend Code',
    already_chef: 'Already registered? Sign In',
    new_chef_prompt: 'New Home Chef? Start here',

    register_kitchen: 'Register Kitchen',
    step_2_title: 'Step 2 of 3 • Kitchen & Hygiene Setup',
    amma_chef_photo: 'Amma / Chef Photo',
    kitchen_name: 'Kitchen Name',
    kitchen_name_placeholder: "e.g., Amma's Kitchen",
    owner_full_name: 'Owner Full Name',
    owner_name_placeholder: 'Enter owner full name',
    fssai_title: 'FSSAI Registration / Hygiene Declaration',
    fssai_placeholder: '14-digit FSSAI number',
    fssai_verified: 'Verified (Govt API)',
    fssai_verifying: 'Connecting to FoSCoS Govt API Bridge...',
    kitchen_address: 'Kitchen Location / Address',
    kitchen_address_placeholder: 'Door No, Street Name, Landmark, Area, City',
    privacy_shield: 'Chef Safety Shield: Exact address is kept confidential. Revealed only during pickup window.',
    cuisine_specialties: 'Cuisine Specialties (Select all that apply)',
    pure_veg: 'Pure Veg',
    south_indian: 'South Indian',
    north_indian: 'North Indian',
    home_sweets: 'Home Sweets & Snacks',
    andhra_style: 'Andhra Style',
    safety_declaration_title: 'Declaration of Food Safety & Fair Pricing:',
    safety_declaration_desc: 'I declare that food is prepared freshly in hygienic domestic kitchen conditions, and pricing is reasonable for our community.',
    continue_to_banking: 'Continue to Banking & Payout Details',

    banking_title: 'Bankings & Payouts',
    step_3_title: 'Step 3 of 3 • Direct Weekly Bank Settlements',
    account_holder: 'Account Holder Name',
    account_holder_placeholder: 'Name as per bank passbook / PAN',
    bank_name: 'Bank Name',
    bank_name_placeholder: 'e.g., HDFC Bank, SBI, Canara Bank',
    account_number: 'Account Number',
    ifsc_code: 'IFSC Code',
    upi_id: 'UPI ID (Optional for Instant Transfers)',
    upi_placeholder: 'e.g., chefname@okhdfcbank',
    direct_payout_title: '100% Direct Chef Payouts',
    direct_payout_desc: 'Weekly earnings are settled directly to this account with zero hidden deductions and transparent weekly settlement reports.',
    open_kitchen_btn: 'Open Kitchen & Enter Dashboard',
    back_to_kitchen_btn: 'Back to Kitchen Details',

    daily_hygiene_required: 'Daily Kitchen Photo Required',
    daily_hygiene_desc: 'Chefs must snap a live photo of their cooking station every morning before orders begin.',
    daily_hygiene_verified: "Today's Kitchen Hygiene Verified",
    daily_hygiene_verified_desc: 'Live photo captured today. Customers can view hygiene badge!',
    open_camera_btn: 'Open Camera & Snap Kitchen',
    retake_camera_btn: 'Retake Live Camera Photo',
    direct_camera_btn: 'Direct Camera',
    live_view: 'LIVE VIEW',
    point_camera_tip: 'Point camera at your clean kitchen cooking counter and tap Shutter.',

    menu_portions_title: 'Kitchen Menu & Portions',
    menu_portions_subtitle: 'Add, edit dishes, adjust available portions',
    add_dish_btn: '+ Add Dish',
    portions_label: 'Portions:',
    edit_btn: 'Edit',
    mark_sold_out: 'Mark Sold Out',
    mark_available: 'Mark Available',
    available_badge: 'Available',
    sold_out_badge: 'Sold Out',
    add_signature_dish: 'Add Signature Dish',
    edit_dish_title: 'Edit Dish Changes',
    dish_photo_optional: 'Dish Photo (Optional)',
    upload_photo: 'Upload Photo',
    change_photo: 'Change Photo',
    remove_photo: 'Remove',
    dish_name_label: 'Dish Name',
    dish_name_placeholder: 'e.g. Masal Dosa with Sambar',
    meal_slot_label: 'Meal Slot',
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snacks: 'Snacks & Sweets',
    food_type_label: 'Food Type',
    price_per_plate: 'Price per Plate (₹)',
    daily_portions_label: 'Daily Portions',
    description_label: 'Description & Ingredients',
    description_placeholder: 'Describe your homemade ingredients and taste...',
    save_dish_btn: 'Save & Add to Menu',
    update_dish_btn: 'Update Dish Changes',
    empty_menu_title: 'Your menu is currently empty.',
    empty_menu_desc: 'Click "+ Add Dish" above to add your first delicious home-cooked item!'
  },

  // 3. TELUGU (తెలుగు)
  te: {
    homepot_chef: 'హోమ్‌పాట్ చెఫ్',
    kitchen_open: 'కిచెన్ తెరిచి ఉంది',
    kitchen_closed: 'కిచెన్ మూసివేయబడింది',
    tap_to_change: 'మార్చడానికి నొక్కండి',
    live_orders: 'లైవ్ ఆర్డర్లు',
    menu: 'వంటల మెనూ',
    bankings: 'బ్యాంకింగ్ & చెల్లింపులు',
    profile: 'ప్రొఫైల్',
    notifications: 'నోటిఫికేషన్లు',
    help_support: 'సహాయం',
    settings: 'సెట్టింగ్‌లు',
    choose_language: 'భాష మార్చండి',

    chef_portal: 'హోమ్‌పాట్ చెఫ్ పోర్టల్',
    authentic_tagline: 'గృహిణుల చేతి కమ్మని ఇంటి భోజనం',
    sign_in: 'చెఫ్ లాగిన్',
    sign_up: 'కొత్త చెఫ్ రిజిస్ట్రేషన్',
    email_address: 'ఈమెయిల్ చిరునామా',
    password: 'పాస్‌వర్డ్',
    mobile_number: 'మొబైల్ నంబర్',
    send_otp: 'ధృవీకరణ కోడ్ పంపండి (OTP)',
    enter_otp: '4 అంకెల కోడ్ నమోదు చేయండి',
    verify_proceed: 'ధృవీకరించి కిచెన్ వివరాలకు వెళ్లండి',
    resend_code: 'మళ్లీ కోడ్ పంపండి',

    register_kitchen: 'కిచెన్ నమోదు',
    step_2_title: 'దశ 2 / 3 • కిచెన్ & పరిశుభ్రత',
    amma_chef_photo: 'అమ్మ / చెఫ్ ఫోటో',
    kitchen_name: 'కిచెన్ పేరు',
    kitchen_name_placeholder: 'ఉదా., అమ్మ చేతి వంట',
    owner_full_name: 'యజమాని పూర్తి పేరు',
    owner_name_placeholder: 'మీ పూర్తి పేరును నమోదు చేయండి',
    fssai_title: 'FSSAI రిజిస్ట్రేషన్ / ఆహార భద్రత',
    fssai_placeholder: '14 అంకెల FSSAI నంబర్',
    fssai_verified: 'ప్రభుత్వ API ధృవీకరించబడింది',
    kitchen_address: 'కిచెన్ చిరునామా',
    kitchen_address_placeholder: 'ఇంటి నంబర్, వీధి, ఏరియా, నగరం',
    cuisine_specialties: 'వంటకాల రకాలు',
    pure_veg: 'పూర్తి శాఖాహారం',
    south_indian: 'దక్షిణ భారత వంటకాలు',
    north_indian: 'ఉత్తర భారత వంటకాలు',
    home_sweets: 'ఇంటి మిఠాయిలు & స్నాక్స్',
    andhra_style: 'ఆంధ్రా రుచులు',
    continue_to_banking: 'బ్యాంకింగ్ వివరాలకు కొనసాగండి',

    banking_title: 'బ్యాంకింగ్ & చెల్లింపులు',
    step_3_title: 'దశ 3 / 3 • వారపు ప్రత్యక్ష బ్యాంక్ సెటిల్‌మెంట్లు',
    account_holder: 'ఖాతాదారుని పేరు',
    bank_name: 'బ్యాంక్ పేరు',
    account_number: 'ఖాతా సంఖ్య',
    ifsc_code: 'IFSC కోడ్',
    upi_id: 'UPI ఐడీ',
    direct_payout_title: '100% ప్రత్యక్ష చెల్లింపుల హామీ',
    direct_payout_desc: 'మీ సంపాదన ప్రతి వారం ఎటువంటి కమీషన్ కోత లేకుండా నేరుగా మీ బ్యాంక్ ఖాతాకు చేరుతుంది.',
    open_kitchen_btn: 'కిచెన్ తెరిచి ఆర్డర్లు ప్రారంభించండి',

    daily_hygiene_required: 'రోజువారీ కిచెన్ ఫోటో అవసరం',
    daily_hygiene_desc: 'ఆర్డర్లు ప్రారంభించడానికి ముందు మీ శుభ్రమైన కిచెన్ ఫోటోను తీయండి.',
    daily_hygiene_verified: 'నేటి కిచెన్ పరిశుభ్రత ధృవీకరించబడింది',
    open_camera_btn: 'కెమెరా తెరిచి ఫోటో తీయండి',

    menu_portions_title: 'కిచెన్ మెనూ & భాగాలు',
    add_dish_btn: '+ వంటకం జోడించండి',
    portions_label: 'భాగాలు:',
    edit_btn: 'సవరించు',
    mark_sold_out: 'అయిపోయిందిగా గుర్తించు',
    mark_available: 'అందుబాటులో ఉంది',
    available_badge: 'అందుబాటులో ఉంది',
    sold_out_badge: 'అయిపోయింది',
    save_dish_btn: 'సేవ్ చేసి మెనూకి జోడించండి'
  },

  // 4. HINDI (हिंदी)
  hi: {
    homepot_chef: 'होमपॉट शेफ',
    kitchen_open: 'किचन खुला है',
    kitchen_closed: 'किचन बंद है',
    tap_to_change: 'बदलने के लिए टैप करें',
    live_orders: 'लाइव ऑर्डर्स',
    menu: 'मेन्यू',
    bankings: 'बैंकिंग व भुगतान',
    profile: 'प्रोफ़ाइल',
    notifications: 'सूचनाएं',
    help_support: 'सहायता',
    settings: 'सेटिंग्स',
    choose_language: 'भाषा बदलें',

    chef_portal: 'होमपॉट शेफ पोर्टल',
    authentic_tagline: 'गृहणियों के हाथों का शुद्ध घर का खाना',
    sign_in: 'शेफ लॉगिन',
    sign_up: 'नया शेफ पंजीकरण',
    email_address: 'ईमेल पता',
    password: 'पासवर्ड',
    mobile_number: 'मोबाइल नंबर',
    send_otp: 'सत्यापन कोड भेजें (OTP)',
    enter_otp: '4 अंकों का कोड दर्ज करें',
    verify_proceed: 'सत्यापित करें और आगे बढ़ें',
    resend_code: 'कोड पुनः भेजें',

    register_kitchen: 'किचन पंजीकरण',
    step_2_title: 'चरण 2 / 3 • किचन और स्वच्छता सेटअप',
    amma_chef_photo: 'अम्मा / शेफ फोटो',
    kitchen_name: 'किचन का नाम',
    kitchen_name_placeholder: 'उदा., माँ की रसोई',
    owner_full_name: 'मालिक का पूरा नाम',
    owner_name_placeholder: 'अपना पूरा नाम दर्ज करें',
    fssai_title: 'FSSAI पंजीकरण / खाद्य सुरक्षा',
    fssai_placeholder: '14 अंकों का FSSAI नंबर',
    fssai_verified: 'सरकारी API सत्यापित',
    kitchen_address: 'किचन का पता',
    kitchen_address_placeholder: 'मकान नं., सड़क, इलाका, शहर',
    cuisine_specialties: 'विशेषताएं',
    pure_veg: 'शुद्ध शाकाहारी',
    south_indian: 'दक्षिण भारतीय',
    north_indian: 'उत्तर भारतीय',
    home_sweets: 'घर की मिठाइयां व नमकीन',
    andhra_style: 'आंध्रा शैली',
    continue_to_banking: 'बैंकिंग विवरण भरें',

    banking_title: 'बैंकिंग और भुगतान',
    step_3_title: 'चरण 3 / 3 • साप्ताहिक प्रत्यक्ष बैंक भुगतान',
    account_holder: 'खाता धारक का नाम',
    bank_name: 'बैंक का नाम',
    account_number: 'खाता संख्या',
    ifsc_code: 'IFSC कोड',
    upi_id: 'UPI आईडी',
    direct_payout_title: '100% प्रत्यक्ष भुगतान गारंटी',
    direct_payout_desc: 'आपकी साप्ताहिक कमाई बिना किसी कटौती के सीधे आपके बैंक खाते में पहुंचेगी।',
    open_kitchen_btn: 'किचन खोलें और ऑर्डर्स शुरू करें',

    daily_hygiene_required: 'दैनिक किचन फोटो आवश्यक है',
    daily_hygiene_desc: 'ऑर्डर शुरू करने से पहले रोज़ सुबह अपने साफ किचन काउंटर की फोटो लें।',
    daily_hygiene_verified: 'आज की किचन स्वच्छता सत्यापित',
    open_camera_btn: 'कैमरा खोलें और फोटो लें',

    menu_portions_title: 'किचन मेनू और भाग',
    add_dish_btn: '+ नया व्यंजन जोड़ें',
    portions_label: 'भाग:',
    edit_btn: 'संपादित करें',
    mark_sold_out: 'समाप्त चिह्नित करें',
    mark_available: 'उपलब्ध चिह्नित करें',
    available_badge: 'उपलब्ध',
    sold_out_badge: 'समाप्त',
    save_dish_btn: 'सेव करें और मेनू में जोड़ें'
  },

  // 5. KANNADA (ಕನ್ನಡ)
  kn: {
    homepot_chef: 'ಹೋಂಪಾಟ್ ಚೆಫ್',
    kitchen_open: 'ಅಡುಗೆಮನೆ ತೆರೆದಿದೆ',
    kitchen_closed: 'ಅಡುಗೆಮನೆ ಮುಚ್ಚಲಾಗಿದೆ',
    tap_to_change: 'ಬದಲಾಯಿಸಲು ಸ್ಪರ್ಶಿಸಿ',
    live_orders: 'ಲೈವ್ ಆರ್ಡರ್‌ಗಳು',
    menu: 'ಮೆನು',
    bankings: 'ಬ್ಯಾಂಕಿಂಗ್ & ಪಾವತಿಗಳು',
    profile: 'ಪ್ರೊಫೈಲ್',
    notifications: 'ಸೂಚನೆಗಳು',
    help_support: 'ಸಹಾಯ',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    choose_language: 'ಭಾಷೆ ಬದಲಾಯಿಸಿ',

    chef_portal: 'ಹೋಂಪಾಟ್ ಚೆಫ್ ಪೋರ್ಟಲ್',
    authentic_tagline: 'ಗೃಹಿಣಿಯರ ಕೈರುಚಿಯ ಶುದ್ಧ ಮನೆ ಊಟ',
    sign_in: 'ಚೆಫ್ ಲಾಗಿನ್',
    sign_up: 'ಹೊಸ ಚೆಫ್ ನೋಂದಣಿ',
    email_address: 'ಇಮೇಲ್ ವಿಳಾಸ',
    password: 'ಪಾಸ್‌ವರ್ಡ್',
    mobile_number: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    send_otp: 'ಪರಿಶೀಲನಾ ಕೋಡ್ ಕಳುಹಿಸಿ (OTP)',
    enter_otp: '4 ಅಂಕಿಗಳ ಕೋಡ್ ನಮೂದಿಸಿ',
    verify_proceed: 'ದೃಢೀಕರಿಸಿ ಮುಂದುವರಿಯಿರಿ',

    register_kitchen: 'ಅಡುಗೆಮನೆ ನೋಂದಣಿ',
    step_2_title: 'ಹಂತ 2 / 3 • ಅಡುಗೆಮನೆ ಮತ್ತು ನೈರ್ಮಲ್ಯ',
    amma_chef_photo: 'ಅಮ್ಮ / ಚೆಫ್ ಫೋಟೋ',
    kitchen_name: 'ಅಡುಗೆಮನೆ ಹೆಸರು',
    kitchen_name_placeholder: 'ಉದಾ., ಅಮ್ಮನ ಅಡುಗೆಮನೆ',
    owner_full_name: 'ಮಾಲೀಕರ ಪೂರ್ಣ ಹೆಸರು',
    fssai_title: 'FSSAI ನೋಂದಣಿ',
    fssai_placeholder: '14 ಅಂಕಿಗಳ FSSAI ಸಂಖ್ಯೆ',
    kitchen_address: 'ವಿಳಾಸ',
    continue_to_banking: 'ಬ್ಯಾಂಕಿಂಗ್ ವಿವರಗಳಿಗೆ ಮುಂದುವರಿಯಿರಿ',

    banking_title: 'ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಪಾವತಿಗಳು',
    step_3_title: 'ಹಂತ 3 / 3 • ನೇರ ವಾರದ ಬ್ಯಾಂಕ್ ಇತ್ಯರ್ಥ',
    account_holder: 'ಖಾತೆದಾರರ ಹೆಸರು',
    bank_name: 'ಬ್ಯಾಂಕ್ ಹೆಸರು',
    account_number: 'ಖಾತೆ ಸಂಖ್ಯೆ',
    ifsc_code: 'IFSC ಕೋಡ್',
    upi_id: 'UPI ಐಡಿ',
    direct_payout_title: '100% ನೇರ ಪಾವತಿ ಭರವಸೆ',
    open_kitchen_btn: 'ಅಡುಗೆಮನೆ ತೆರೆಯಿರಿ & ಪ್ರಾರಂಭಿಸಿ',

    daily_hygiene_required: 'ದೈನಂದಿನ ಅಡುಗೆಮನೆ ಫೋಟೋ ಅಗತ್ಯವಿದೆ',
    daily_hygiene_desc: 'ಆರ್ಡರ್ ಪ್ರಾರಂಭವಾಗುವ ಮೊದಲು ನಿಮ್ಮ ಸ್ವಚ್ಛ ಅಡುಗೆಮನೆಯ ಫೋಟೋ ತೆಗೆಯಿರಿ.',
    daily_hygiene_verified: 'ಇಂದಿನ ನೈರ್ಮಲ್ಯ ದೃಢೀಕರಿಸಲಾಗಿದೆ',
    open_camera_btn: 'ಕ್ಯಾಮೆರಾ ತೆರೆದು ಫೋಟೋ ತೆಗೆಯಿರಿ',

    menu_portions_title: 'ಅಡುಗೆಮನೆ ಮೆನು & ಪ್ರಮಾಣಗಳು',
    add_dish_btn: '+ ಖಾದ್ಯ ಸೇರಿಸಿ',
    portions_label: 'ಪ್ರಮಾಣಗಳು:',
    edit_btn: 'ತಿದ್ದು',
    save_dish_btn: 'ಉಳಿಸಿ ಮತ್ತು ಮೆನುಗೆ ಸೇರಿಸಿ'
  },

  // 6. MALAYALAM (മലയാളം)
  ml: {
    homepot_chef: 'ഹോംപോട്ട് ഷെഫ്',
    kitchen_open: 'അടുക്കള തുറന്നിരിക്കുന്നു',
    kitchen_closed: 'അടുക്കള അടച്ചിരിക്കുന്നു',
    tap_to_change: 'മാറ്റാൻ ക്ലിക്ക് ചെയ്യുക',
    live_orders: 'ലൈവ് ഓർഡറുകൾ',
    menu: 'മെനു',
    bankings: 'ബാങ്കിംഗ് & പേയ്‌മെന്റുകൾ',
    profile: 'പ്രൊഫൈൽ',
    notifications: 'അറിയിപ്പുകൾ',
    help_support: 'സഹായം',
    settings: 'ക്രമീകരണങ്ങൾ',
    choose_language: 'ഭാഷ മാറ്റുക',

    chef_portal: 'ഹോംപോട്ട് ഷെഫ് പോർട്ടൽ',
    authentic_tagline: 'അമ്മമാരുടെ കൈപ്പുണ്യത്തിൽ തനതായ വീട്ടിലുണ്ടാക്കിയ ഭക്ഷണം',
    sign_in: 'ഷെഫ് ലോഗിൻ',
    sign_up: 'പുതിയ ഷെഫ് രജിസ്ട്രേഷൻ',
    email_address: 'ഇമെയിൽ വിലാസം',
    password: 'പാസ്‌വേഡ്',
    mobile_number: 'മൊബൈൽ നമ്പർ',
    send_otp: 'സ്ഥിരീകരണ കോഡ് അയക്കുക (OTP)',
    enter_otp: '4 അക്ക കോഡ് നൽകുക',
    verify_proceed: 'സ്ഥിരീകരിച്ച് തുടരുക',

    register_kitchen: 'അടുക്കള രജിസ്ട്രേഷൻ',
    step_2_title: 'ഘട്ടം 2 / 3 • അടുക്കള & ശുചിത്വം',
    amma_chef_photo: 'അമ്മ / ഷെഫ് ഫോട്ടോ',
    kitchen_name: 'അടുക്കളയുടെ പേര്',
    kitchen_name_placeholder: 'ഉദാ., അമ്മയുടെ അടുക്കള',
    owner_full_name: 'ഉടമയുടെ പൂർണ്ണമായ പേര്',
    fssai_title: 'FSSAI രജിസ്ട്രേഷൻ',
    fssai_placeholder: '14 അക്ക FSSAI നമ്പർ',
    kitchen_address: 'അടുക്കള വിലാസം',
    continue_to_banking: 'ബാങ്കിംഗ് വിവരങ്ങളിലേക്ക് പോകുക',

    banking_title: 'ബാങ്കിംഗ് & പേയ്‌മെന്റുകൾ',
    step_3_title: 'ഘട്ടം 3 / 3 • പ്രതിവാര നേരിട്ടുള്ള ബാങ്ക് കൈമാറ്റം',
    account_holder: 'അക്കൗണ്ട് ഉടമയുടെ പേര്',
    bank_name: 'ബാങ്കിന്റെ പേര്',
    account_number: 'അക്കൗണ്ട് നമ്പർ',
    ifsc_code: 'IFSC കോഡ്',
    upi_id: 'UPI ഐഡി',
    direct_payout_title: '100% നേരിട്ടുള്ള പേയ്‌മെന്റ് ഉറപ്പ്',
    open_kitchen_btn: 'അടുക്കള തുറന്ന് ഓർഡറുകൾ ആരംഭിക്കുക',

    daily_hygiene_required: 'പ്രതിദിന അടുക്കള ഫോട്ടോ ആവശ്യമാണ്',
    daily_hygiene_desc: 'ഓർഡറുകൾ ആരംഭിക്കുന്നതിന് മുമ്പ് നിങ്ങളുടെ വൃത്തിയുള്ള അടുക്കള ഫോട്ടോ എടുക്കുക.',
    daily_hygiene_verified: 'ഇന്നത്തെ അടുക്കള ശുചിത്വം സ്ഥിരീകരിച്ചു',
    open_camera_btn: 'ക്യാമറ തുറന്ന് ഫോട്ടോ എടുക്കുക',

    menu_portions_title: 'അടുക്കള മെനു & അളവുകൾ',
    add_dish_btn: '+ വിഭവം ചേർക്കുക',
    portions_label: 'അളവുകൾ:',
    edit_btn: 'മാറ്റങ്ങൾ വരുത്തുക',
    save_dish_btn: 'സേവ് ചെയ്ത് മെനുവിൽ ചേർക്കുക'
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('homepot_chef_language') || 'ta'; // Default to Tamil or English!
  });

  useEffect(() => {
    localStorage.setItem('homepot_chef_language', currentLang);
  }, [currentLang]);

  const t = (key) => {
    const langDict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return key;
  };

  const changeLanguage = (langCode) => {
    if (TRANSLATIONS[langCode]) {
      setCurrentLang(langCode);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage: changeLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
