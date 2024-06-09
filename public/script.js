

const caseCategory=document.getElementsByClassName('case-category')[0];

const categoryBtn=document.getElementById('caseCategory');

// const commiteeBtn=document.getElementById('Comittee');

// const commiteeContainer=document.getElementsByClassName('committee')[0];


const pdf=document.getElementById('pdf');



const vcRule=document.getElementById('vcRule');

vcRule.addEventListener("click",()=>{
    const url1='https://delhihighcourt.nic.in/uploads/VC_Rules2021.pdf';
    openPDF(url1);
    
});


// function openCommittee(){

//     if (commiteeContainer.style.display === "none") {
//         commiteeContainer.style.display = "block";
//     } else {
//         commiteeContainer.style.display = "none";
//     }

// }

// commiteeBtn.addEventListener("click",()=>{
      
//       openCommittee()
//  });


function openPDF(pdfUrl) {
    window.open(pdfUrl, '_blank');
  }

  // Event listener for div click
  pdf.addEventListener('click',function() {
    const pdfUrl = 'https://delhihighcourt.nic.in/uploads/commitee/42284153465f5766bd90ec.pdf'; // Replace 'path_to_your_pdf_file.pdf' with the actual path to your PDF file
    openPDF(pdfUrl);
  });





// function myFunction() {
    
//     if (caseCategory.style.display === "none") {
//         caseCategory.style.display = "block";
//     } else {
//         caseCategory.style.display = "none";
//     }
//   }
categoryBtn.addEventListener("click",()=>{
       myFunction();
});
