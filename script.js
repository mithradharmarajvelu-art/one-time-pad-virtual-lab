
let generatedKey = null;
let encryptedData = null;
let originalLength = 0;

// Convert bytes into hexadecimal
function toHex(bytes) {
    return Array.from(bytes)
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join(" ").toUpperCase();
}

// Generate a random secret key
function generateKey() {
    const message = document.getElementById("plaintext").value;

    if (!message) {
        alert("Please enter a message first!");
        return;
    }

    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(message);

    generatedKey = new Uint8Array(messageBytes.length);
    crypto.getRandomValues(generatedKey);

    originalLength = messageBytes.length;

    document.getElementById("secretKey").value =
        toHex(generatedKey);

    document.getElementById("ciphertext").value = "";
    document.getElementById("decrypted").value = "";
    document.getElementById("xorResult").innerHTML =
        "Random key generated successfully!";

    encryptedData = null;
}

// Encrypt using XOR
function encryptMessage() {
    const message = document.getElementById("plaintext").value;

    if (!message || !generatedKey) {
        alert("Enter a message and generate a key first!");
        return;
    }

    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(message);

    if (messageBytes.length !== originalLength) {
        alert("Message changed! Generate a new key.");
        return;
    }

    encryptedData = new Uint8Array(messageBytes.length);

    for (let i = 0; i < messageBytes.length; i++) {
        encryptedData[i] = messageBytes[i] ^ generatedKey[i];
    }

    document.getElementById("ciphertext").value =
        toHex(encryptedData);

    showXOR(messageBytes, generatedKey, encryptedData);

    document.getElementById("decrypted").value = "";
}

// Display binary XOR operations
function showXOR(plain, key, cipher) {
    let output = "";

    const limit = Math.min(plain.length, 12);

    for (let i = 0; i < limit; i++) {
        const binary = value =>
            value.toString(2).padStart(8, "0");

        output += `
            <p><b>Byte ${i + 1}</b></p>
            <p>Plaintext: ${binary(plain[i])}</p>
            <p>Secret Key: ${binary(key[i])}</p>
            <p>Ciphertext: ${binary(cipher[i])}</p>
            <hr>
        `;
    }

    if (plain.length > limit) {
        output += "<p>Showing the first 12 bytes only.</p>";
    }

    document.getElementById("xorResult").innerHTML = output;
}

// Decrypt using the same key
function decryptMessage() {
    if (!generatedKey || !encryptedData) {
        alert("Encrypt the message first!");
        return;
    }

    const decryptedBytes = new Uint8Array(encryptedData.length);

    for (let i = 0; i < encryptedData.length; i++) {
        decryptedBytes[i] =
            encryptedData[i] ^ generatedKey[i];
    }

    const decoder = new TextDecoder("utf-8", { fatal: true });

    document.getElementById("decrypted").value =
        decoder.decode(decryptedBytes);
}

// Reset the experiment
function resetLab() {
    document.getElementById("plaintext").value = "";
    document.getElementById("secretKey").value = "";
    document.getElementById("ciphertext").value = "";
    document.getElementById("decrypted").value = "";
    document.getElementById("xorResult").innerHTML =
        "Perform encryption to view the XOR operation.";

    generatedKey = null;
    encryptedData = null;
    originalLength = 0;
}
