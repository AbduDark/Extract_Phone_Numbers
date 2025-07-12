
let extractedList = [];

function extractNumbers() {
    const textArea = document.getElementById("inputText");
    const text = textArea.value;
    const regex = /(?:\+?2)?01\d{9}/g;
    const matches = text.match(regex) || [];
    const resultList = document.getElementById("result");
    resultList.innerHTML = "";
    extractedList = [];

    const counts = {};
    const formatted = matches.map(num => {
        let formattedNum = num.replace(/^\+?2/, '');
        return '2' + formattedNum;
    });

    const unique = [];
    formatted.forEach(num => {
        if (counts[num]) {
            counts[num]++;
        } else {
            counts[num] = 1;
            unique.push(num);
        }
    });

    if (unique.length === 0) {
        resultList.innerHTML = "<li>لم يتم العثور على أرقام صالحة.</li>";
        return;
    }

    unique.forEach(num => {
        const li = document.createElement("li");
        const label = num + (counts[num] > 1 ? " (مكرر)" : "");
        li.textContent = label;
        resultList.appendChild(li);
        extractedList.push(label);
    });
}

function copyNumbers() {
    if (!extractedList.length) {
        alert("لا توجد أرقام لنسخها.");
        return;
    }
    const text = extractedList.join("\n");
    navigator.clipboard.writeText(text).then(() => {
        alert("تم نسخ الأرقام إلى الحافظة ✅");
    }).catch(() => {
        alert("فشل في النسخ.");
    });
}

function downloadNumbers() {
    if (!extractedList.length) {
        alert("لا توجد أرقام لحفظها.");
        return;
    }
    const blob = new Blob([extractedList.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "extracted_numbers.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function clearAll() {
    document.getElementById("inputText").value = "";
    document.getElementById("result").innerHTML = "";
    extractedList = [];
}

// Fix for iPhone multi-line paste issue
document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText");
    inputText.setAttribute("autocapitalize", "off");
    inputText.setAttribute("autocorrect", "off");
    inputText.setAttribute("spellcheck", "false");

    inputText.addEventListener("paste", function (e) {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData("text");
        const processed = text.replace(/\r/g, "");
        document.execCommand("insertText", false, processed);
    });
});
