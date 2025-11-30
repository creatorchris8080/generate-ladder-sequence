document.addEventListener("DOMContentLoaded", () => {
    const enterPrompt = document.querySelector("#enterPrompt");
    const findSeq = document.querySelector("#findSeq");
    const updateBtn = document.querySelector("#update");
    const numberGroup = document.querySelector("#numberGroup");
    const subSeq = document.querySelector("#subSeq");
    const twoGroupsDiv = document.querySelector("#twoGroups");
    const fgTemplate = document.getElementById("linkoutputFG");
    const sgTemplate = document.getElementById("linkoutputSG");

    const fgParent = fgTemplate ? fgTemplate.parentElement : null;
    const sgParent = sgTemplate ? sgTemplate.parentElement : null;

    if (fgTemplate) fgTemplate.style.display = "none";
    if (sgTemplate) sgTemplate.style.display = "none";

    const subsegFG = document.getElementById("subsegoflastFG");
    const subsegSG = document.getElementById("subsegoflastSG");
    const moreFG = document.getElementById("subseqofmoreFG");
    const moreSG = document.getElementById("subseqofmoreSG");
    const moreThanTwoDiv = document.getElementById("morethantwoGroups");
    const moreThanTwoTemplate = document.getElementById("morethantwogroupsClone");

    if (moreThanTwoTemplate) moreThanTwoTemplate.style.display = "none";

    function createGroupedOutput(str) {
        if (!str) return { output: "", count: 0, groups: [] };

        const groups = [];
        let current = "";
        let used = new Set();

        for (let c of str) {
            if (/[A-Z]/.test(c)) {
                if (used.has(c)) {
                    groups.push(current);
                    current = c;
                    used = new Set([c]);
                } else {
                    current += c;
                    used.add(c);
                }
            } else {
                current += c;
            }
        }
        if (current) groups.push(current);

        return {
            output: groups.join("/"),
            count: groups.length,
            groups: groups
        };
    }

    function createSubSequence(groups) {
        const bit = s => (s === "+" ? "1" : "0");

        return groups.map(g => {
            let out = "";
            for (let i = 0; i < g.length; i++) {
                let ch = g[i];
                if (/[A-Z]/.test(ch)) {
                    let sign = "+";

                    for (let j = i + 1; j < g.length; j++) {
                        if (g[j] === "+" || g[j] === "-") {
                            sign = g[j];
                            break;
                        }
                        if (/[A-Z]/.test(g[j])) break;
                    }
                    out += ch.toLowerCase() + bit(sign);
                }
            }
            return out;
        }).join("/");
    }

    const extractPairs = s => s.match(/[a-z][0-1]/g) || [];

    function clearClones(parent, className) {
        if (!parent) return;
        parent.querySelectorAll("." + className).forEach(e => e.remove());
    }

    function cloneForSubseq(parent, template, pairs, cloneClass) {
        if (!parent || !template) return [];
        clearClones(parent, cloneClass);
        const usable = pairs.slice(0, -1);

        usable.forEach(val => {
            const clone = template.cloneNode(true);
            clone.style.display = "block";
            clone.classList.add(cloneClass);

            let holder = clone.querySelector(".subseq-no, .subseq-nc");
            if (holder) holder.textContent = val;

            parent.appendChild(clone);
        });

        return usable;
    }

    function cloneSequenceOutput(sequenceStr) {
        const template = document.getElementById("outputcloning");
        if (!template) return;
        const parent = template.parentElement;

        parent.querySelectorAll(".seqClone").forEach(e => e.remove());
        template.style.display = "none";

        const pairs = sequenceStr.match(/[A-Z][+-]/g) || [];

        pairs.forEach(val => {
            const clone = template.cloneNode(true);
            clone.classList.add("seqClone");
            clone.style.display = "block";

            const holder = clone.querySelector("#sequenceOutputs");
            if (holder) holder.textContent = val;

            parent.appendChild(clone);
        });
    }

    function cloneLutchMore(innerParent, groupIndex, subseqParts) {
        if (!innerParent) return;
        const template = innerParent.querySelector("#linkoutputlutchmoreGroups");
        if (!template) return;

        const parent = template.parentElement;
        parent.querySelectorAll(".lutchMoreClone").forEach(e => e.remove());

        template.style.display = "none";

        const pairs = subseqParts[groupIndex].match(/[a-z][0-1]/g) || [];

        const displaySeq = pairs.slice(0, -1);

        displaySeq.forEach(seq => {
            const clone = template.cloneNode(true);
            clone.classList.add("lutchMoreClone");
            clone.style.display = "block";

            const secHolder = clone.querySelector("#secsubseqNO");
            if (secHolder) secHolder.textContent = seq;

            parent.appendChild(clone);
        });
    }

    function cloneOutputMoreGroups(groups) {
        const template = document.getElementById("outputcloningmoreGroups");
        if (!template) return;
        const parent = template.parentElement;

        parent.querySelectorAll(".outMoreClone").forEach(e => e.remove());
        template.style.display = "none";

        const total = groups.length;

        for (let i = 0; i < total; i++) {
            const relayClone = template.cloneNode(true);
            relayClone.classList.add("outMoreClone");
            relayClone.style.display = "block";
            const relayHolder = relayClone.querySelector("#sequenceOutputsmoreGroups");
            if (relayHolder) relayHolder.textContent = "R" + i;
            parent.appendChild(relayClone);

            const pairs = (groups[i].match(/[A-Z][+-]/g) || []);
            pairs.forEach(pair => {
                const pairClone = template.cloneNode(true);
                pairClone.classList.add("outMoreClone");
                pairClone.style.display = "block";
                const pairHolder = pairClone.querySelector("#sequenceOutputsmoreGroups");
                if (pairHolder) pairHolder.textContent = pair;
                parent.appendChild(pairClone);
            });
        }
    }

    function cloneMoreThanTwoGroups(groups, subseqParts) {

        if (!moreThanTwoDiv) return;
        const mainParent = moreThanTwoDiv.parentElement;

        clearClones(mainParent, "moreGroupParentClone");
        moreThanTwoDiv.style.display = "none";
        if (moreThanTwoTemplate) moreThanTwoTemplate.style.display = "none";

        const total = groups.length;

        const subseqLast = subseqParts.map(part => {
            const arr = part.match(/[a-z][0-1]/g);
            return arr ? arr[arr.length - 1] : "";
        });

        const rotatedSubseq = [];
        for (let i = 0; i < total; i++) {
            rotatedSubseq.push(subseqLast[(total - 1 + i) % total]);
        }

        groups.forEach((g, index) => {

            const newParent = moreThanTwoDiv.cloneNode(true);
            newParent.classList.add("moreGroupParentClone");
            newParent.style.display = "block";

            const inner = newParent.querySelector("#morethantwogroupsClone");
            if (inner) inner.style.display = "block";

            const label = newParent.querySelector(".mt-group-label");
            if (label) label.textContent = "Group " + (index + 1);

            const relayL = newParent.querySelector("#relaylutchDisplay");
            if (relayL) relayL.textContent = "R" + index;

            const relayNO = newParent.querySelector("#relayNC");
            if (relayNO) relayNO.textContent = "R" + ((index + 1) % total);

            const relayNC = newParent.querySelector("#relayNO");
            if (relayNC) relayNC.textContent = "R" + ((index - 1 + total) % total);

            const subseqInput = newParent.querySelector("#subseqinputNO");
            if (subseqInput) subseqInput.textContent = rotatedSubseq[index];

            cloneLutchMore(inner, index, subseqParts);

            mainParent.appendChild(newParent);
        });

        cloneOutputMoreGroups(groups);
    }

    function UpdateData() {

        document.querySelectorAll(".note").forEach(e => e.style.display = "none");
        const newPrompt = (enterPrompt.value || "").toUpperCase();
        
        enterPrompt.placeholder = newPrompt;
        const result = createGroupedOutput(newPrompt);
        const groups = result.groups;
        const groupCount = result.count;
        const subseq = createSubSequence(groups);
        const subseqParts = subseq.split("/");
        const fgPairs = subseqParts[0] ? extractPairs(subseqParts[0]) : [];
        const sgPairs = subseqParts[1] ? extractPairs(subseqParts[1]) : [];
        const outputBox = document.getElementById("outputBox");
        
        if (outputBox) outputBox.style.display = "none";

        twoGroupsDiv.style.display = (groupCount === 2 ? "block" : "none");
        if (moreThanTwoDiv) moreThanTwoDiv.style.display = (groupCount > 2 ? "block" : "none");

        if (groupCount > 2) {
            cloneMoreThanTwoGroups(groups, subseqParts);
        } else {
            const outTemplate = document.getElementById("outputcloningmoreGroups");
            if (outTemplate && outTemplate.parentElement) {
                outTemplate.parentElement.querySelectorAll(".outMoreClone").forEach(e => e.remove());
            }
        }

        if (fgPairs.length > 0) subsegFG.textContent = fgPairs[fgPairs.length - 1];
        if (sgPairs.length > 0) subsegSG.textContent = sgPairs[sgPairs.length - 1];

        const usedFG = cloneForSubseq(fgParent, fgTemplate, fgPairs, "fgClone");
        const usedSG = cloneForSubseq(sgParent, sgTemplate, sgPairs, "sgClone");

        moreFG.textContent = usedFG[0] || "";
        moreSG.textContent = usedSG[0] || "";

        cloneSequenceOutput(result.output);

        const lutchValue = createLutch(groups);

        /*
        update(ref(db, "Prompt/Input"), { Prompt: newPrompt });
        update(ref(db, "Prompt/Output"), {
            Sequence: result.output,
            Group: groupCount,
            subSequence: subseq,
            lutch: lutchValue
        }); 
        */
    }

    updateBtn.addEventListener("click", (event) => {
        event.preventDefault();
        UpdateData();
    });

    const reloadButton = document.getElementById('reloadButton');

    reloadButton.addEventListener('click', () => {
        window.location.reload();
    });

});



