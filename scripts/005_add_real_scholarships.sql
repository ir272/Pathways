-- Add real scholarship opportunities for 2025-2026
-- This replaces sample data with actual scholarships, community programs, and special opportunities

-- Clear existing sample data first
DELETE FROM public.scholarship_matches;
DELETE FROM public.saved_scholarships;
DELETE FROM public.scholarships;

-- Insert real scholarship opportunities
INSERT INTO public.scholarships (
  title,
  organization,
  amount,
  deadline,
  description,
  eligibility_criteria,
  scholarship_type,
  application_url,
  requirements,
  tags,
  target_demographics,
  matching_criteria
) VALUES 

-- MAJOR NATIONAL SCHOLARSHIPS
(
  'The Gates Scholarship',
  'Gates Foundation',
  'Full tuition + expenses',
  '2025-09-15',
  'Highly selective scholarship for high school seniors from minority groups who are Pell Grant eligible. Covers tuition, fees, room and board, books, transportation, and personal expenses for up to 5 years.',
  ARRAY['High school senior', 'Minority background', 'Pell Grant eligible', 'GPA 3.3 or higher', 'U.S. citizen or permanent resident'],
  'need-based',
  'https://www.thegatesscholarship.org/scholarship',
  ARRAY['FAFSA completion', 'Academic transcripts', 'Leadership portfolio', 'Community service documentation', 'Personal essays'],
  ARRAY['gates', 'full-ride', 'minority', 'pell-eligible', 'leadership'],
  '{"income_levels": ["low"], "demographics": ["minority"], "pell_eligible": true, "leadership": true}',
  '{"income_level": {"low": 30}, "gpa_range": {"3.5-4.0": 25, "3.0-3.4": 15}, "language_support": {"english-second": 15, "multilingual": 10}}'
),

(
  'Jack Kent Cooke College Scholarship',
  'Jack Kent Cooke Foundation',
  'Up to $55,000/year',
  '2025-11-12',
  'For high-achieving high school seniors with financial need seeking to attend top four-year colleges. Provides last-dollar funding covering tuition, living expenses, books, and fees.',
  ARRAY['High school senior', 'Financial need', 'Academic excellence', 'Leadership potential', 'First-generation college preferred'],
  'merit-based',
  'https://www.jkcf.org/our-scholarships/college-scholarship-program/',
  ARRAY['Academic transcripts', 'SAT/ACT scores', 'Financial documentation', 'Leadership essays', 'Teacher recommendations'],
  ARRAY['cooke', 'merit-based', 'high-achieving', 'financial-need', 'leadership'],
  '{"income_levels": ["low", "moderate"], "first_gen_preferred": true, "academic_excellence": true}',
  '{"income_level": {"low": 25, "moderate": 20}, "gpa_range": {"3.5-4.0": 30}, "education_level": {"high-school": 20}}'
),

-- STEM SCHOLARSHIPS
(
  'NASA Iowa Space Grant Consortium Scholarship',
  'NASA Iowa Space Grant Consortium',
  '$5,000',
  '2025-06-09',
  'For undergraduate students pursuing STEM degrees that support NASA mission. Requires U.S. citizenship and strong academic performance in science, technology, engineering, or mathematics.',
  ARRAY['STEM major', 'U.S. citizen', 'GPA 3.0 or higher', 'Undergraduate student', 'NASA mission alignment'],
  'stem',
  'https://www.iaspacegrant.org/scholarships',
  ARRAY['STEM coursework transcript', 'NASA mission essay', 'Faculty recommendation', 'Research project description'],
  ARRAY['nasa', 'stem', 'space', 'engineering', 'science'],
  '{"majors": ["engineering", "computer-science", "physics", "mathematics", "astronomy"], "citizenship": "US"}',
  '{"gpa_range": {"3.0-3.4": 15, "3.5-4.0": 25}, "education_level": {"undergraduate": 20}}'
),

(
  'Young Women in STEM Scholarship',
  'STEM Education Coalition',
  '$15,000',
  '2025-06-10',
  'Supporting low-income female high school seniors and undergraduates majoring in STEM fields. Promotes gender diversity in science, technology, engineering, and mathematics careers.',
  ARRAY['Female-identifying', 'STEM major', 'Low income', 'High school senior or undergraduate', 'Academic achievement'],
  'stem',
  'https://www.stemeducationcoalition.org/scholarships',
  ARRAY['STEM academic records', 'Financial need documentation', 'Gender diversity essay', 'Career goals statement'],
  ARRAY['women-in-stem', 'female', 'diversity', 'low-income', 'stem'],
  '{"gender": "female", "income_levels": ["low"], "majors": ["stem"], "diversity": true}',
  '{"income_level": {"low": 30}, "gpa_range": {"3.0-3.4": 15, "3.5-4.0": 20}, "education_level": {"high-school": 15, "undergraduate": 15}}'
),

(
  'Future Women In STEM Scholarship',
  'Bold.org',
  '$1,040',
  '2025-12-01',
  'Awards female-identifying students from historically underrepresented groups pursuing STEM degrees. Focuses on increasing diversity and inclusion in STEM fields.',
  ARRAY['Female-identifying', 'Underrepresented group', 'STEM field', 'High school senior or undergraduate'],
  'stem',
  'https://bold.org/scholarships/future-women-in-stem-scholarship/',
  ARRAY['STEM program enrollment', 'Diversity statement', 'Academic transcript', 'Future goals essay'],
  ARRAY['women-stem', 'diversity', 'underrepresented', 'inclusion'],
  '{"gender": "female", "demographics": ["underrepresented"], "majors": ["stem"]}',
  '{"gpa_range": {"2.5-2.9": 10, "3.0-3.4": 15, "3.5-4.0": 20}, "language_support": {"english-second": 15, "multilingual": 10}}'
),

-- DIVERSITY AND MINORITY SCHOLARSHIPS
(
  'UNCF General Scholarship',
  'United Negro College Fund',
  '$1,000 - $8,000',
  '2025-10-15',
  'Supporting African American students attending UNCF member institutions. Provides financial assistance based on academic merit and financial need.',
  ARRAY['African American', 'UNCF member school', 'Financial need', 'Academic achievement', 'U.S. citizen'],
  'need-based',
  'https://uncf.org/scholarships',
  ARRAY['FAFSA completion', 'Academic transcripts', 'Personal essay', 'Community involvement documentation'],
  ARRAY['uncf', 'african-american', 'minority', 'financial-need', 'hbcu'],
  '{"demographics": ["african-american"], "school_type": "uncf_member", "financial_need": true}',
  '{"income_level": {"low": 25, "moderate": 20}, "gpa_range": {"3.0-3.4": 15, "3.5-4.0": 20}}'
),

(
  'Hispanic Scholarship Fund General Scholarship',
  'Hispanic Scholarship Fund',
  '$1,000 - $5,000',
  '2025-12-15',
  'Supporting Hispanic/Latino students pursuing higher education. Awards based on academic achievement, financial need, and community involvement.',
  ARRAY['Hispanic/Latino heritage', 'GPA 3.0 or higher', 'Financial need', 'Community college, undergraduate, or graduate'],
  'need-based',
  'https://www.hsf.net/scholarship',
  ARRAY['Academic transcripts', 'Financial aid documents', 'Community service record', 'Personal statement'],
  ARRAY['hispanic', 'latino', 'minority', 'community-service', 'financial-need'],
  '{"demographics": ["hispanic", "latino"], "community_involvement": true, "financial_need": true}',
  '{"income_level": {"low": 25, "moderate": 20}, "gpa_range": {"3.0-3.4": 15, "3.5-4.0": 20}, "language_support": {"english-second": 20, "multilingual": 15}}'
),

-- FIRST-GENERATION SCHOLARSHIPS
(
  'First Generation Matching Grant Program',
  'Council for Opportunity in Education',
  '$1,000 - $3,000',
  '2025-04-30',
  'Supporting first-generation college students who demonstrate academic potential and financial need. Provides matching funds to supplement other financial aid.',
  ARRAY['First-generation college student', 'Financial need', 'Academic potential', 'Enrolled in degree program'],
  'first-gen',
  'https://www.coenet.org/scholarships',
  ARRAY['First-generation documentation', 'Financial aid forms', 'Academic progress report', 'Personal narrative'],
  ARRAY['first-generation', 'matching-grant', 'financial-need', 'academic-potential'],
  '{"first_gen": true, "financial_need": true, "academic_support": true}',
  '{"income_level": {"low": 30, "moderate": 25}, "education_level": {"community-college": 20, "undergraduate": 20}}'
),

-- COMMUNITY COLLEGE AND TRANSFER SCHOLARSHIPS
(
  'Phi Theta Kappa Transfer Scholarship',
  'Phi Theta Kappa Honor Society',
  '$1,000 - $30,000',
  '2025-03-01',
  'For community college students transferring to four-year institutions. Recognizes academic excellence and leadership in the Phi Theta Kappa Honor Society.',
  ARRAY['Phi Theta Kappa member', 'Community college student', 'Transferring to 4-year institution', 'GPA 3.5 or higher'],
  'merit-based',
  'https://www.ptk.org/scholarships',
  ARRAY['PTK membership verification', 'Academic transcripts', 'Transfer acceptance letter', 'Leadership portfolio'],
  ARRAY['phi-theta-kappa', 'transfer', 'community-college', 'honor-society', 'leadership'],
  '{"education_level": ["community-college"], "honor_society": "ptk", "transfer_student": true}',
  '{"education_level": {"community-college": 30}, "gpa_range": {"3.5-4.0": 25}}'
),

(
  'Coca-Cola Leaders of Promise Scholarship',
  'Coca-Cola Scholars Foundation',
  '$1,000',
  '2025-05-31',
  'For community college students who demonstrate leadership and commitment to community service. Supports students transferring to four-year institutions.',
  ARRAY['Community college student', 'Leadership experience', 'Community service', 'Academic achievement', 'Transfer intent'],
  'community-service',
  'https://www.coca-colascholarsfoundation.org/apply/',
  ARRAY['Community college transcripts', 'Leadership documentation', 'Community service record', 'Transfer plans'],
  ARRAY['coca-cola', 'leadership', 'community-service', 'transfer', 'community-college'],
  '{"education_level": ["community-college"], "leadership": true, "community_service": true}',
  '{"education_level": {"community-college": 25}, "gpa_range": {"3.0-3.4": 15, "3.5-4.0": 20}}'
),

-- NEED-BASED AND ACCESS SCHOLARSHIPS
(
  'Federal Pell Grant',
  'U.S. Department of Education',
  '$740 - $7,395',
  '2025-06-30',
  'Federal grant for undergraduate students with exceptional financial need. Does not need to be repaid and forms the foundation of federal student aid.',
  ARRAY['Undergraduate student', 'Financial need', 'U.S. citizen or eligible non-citizen', 'Valid Social Security number'],
  'need-based',
  'https://studentaid.gov/understand-aid/types/grants/pell',
  ARRAY['FAFSA completion', 'Tax returns', 'Bank statements', 'Social Security card'],
  ARRAY['pell-grant', 'federal-aid', 'need-based', 'undergraduate', 'financial-need'],
  '{"income_levels": ["low"], "financial_need": true, "federal_aid": true}',
  '{"income_level": {"low": 30}, "education_level": {"community-college": 20, "undergraduate": 20}}'
),

-- ACCESSIBILITY AND LEARNING DIFFERENCES
(
  'Anne Ford Scholarship',
  'National Center for Learning Disabilities',
  '$10,000',
  '2025-05-01',
  'For graduating high school seniors with documented learning disabilities who are pursuing post-secondary education. Recognizes academic achievement despite learning challenges.',
  ARRAY['Learning disability documentation', 'High school senior', 'Post-secondary enrollment', 'Academic achievement', 'Self-advocacy skills'],
  'need-based',
  'https://www.ncld.org/scholarships-and-awards/anne-ford-scholarship/',
  ARRAY['Learning disability documentation', 'Academic transcripts', 'Self-advocacy essay', 'Recommendation letters'],
  ARRAY['learning-disabilities', 'accessibility', 'self-advocacy', 'academic-achievement'],
  '{"learning_needs": ["dyslexia", "adhd", "other"], "accessibility_support": true, "self_advocacy": true}',
  '{"learning_needs": {"dyslexia": 30, "adhd": 30, "other": 30}, "gpa_range": {"3.0-3.4": 15, "3.5-4.0": 20}}'
),

-- ARTS AND CREATIVE SCHOLARSHIPS
(
  'Scholastic Art & Writing Awards',
  'Alliance for Young Artists & Writers',
  '$500 - $10,000',
  '2025-01-15',
  'Recognizing exceptional creative work by students in grades 7-12. Awards scholarships for outstanding achievement in art and writing.',
  ARRAY['Grades 7-12', 'Original creative work', 'Art or writing focus', 'Portfolio submission'],
  'arts',
  'https://www.artandwriting.org/scholarships/',
  ARRAY['Creative portfolio', 'Artist statement', 'Academic transcripts', 'Teacher recommendation'],
  ARRAY['scholastic', 'arts', 'writing', 'creative', 'portfolio'],
  '{"creative_focus": true, "portfolio_based": true, "arts_focus": ["visual", "writing"]}',
  '{"gpa_range": {"2.5-2.9": 10, "3.0-3.4": 15, "3.5-4.0": 20}}'
),

-- COMMUNITY SERVICE SCHOLARSHIPS
(
  'Prudential Spirit of Community Awards',
  'Prudential Financial',
  '$1,000 - $5,000',
  '2025-11-01',
  'Honoring young volunteers who have made meaningful contributions to their communities. Recognizes outstanding community service by middle and high school students.',
  ARRAY['Middle or high school student', 'Significant community service', 'Leadership in service', 'Measurable impact'],
  'community-service',
  'https://www.prudential.com/about/prudential-spirit-community-awards',
  ARRAY['Community service documentation', 'Impact measurement', 'Service project description', 'Recommendation letters'],
  ARRAY['prudential', 'community-service', 'volunteer', 'leadership', 'impact'],
  '{"community_service": true, "leadership": true, "measurable_impact": true}',
  '{"gpa_range": {"3.0-3.4": 15, "3.5-4.0": 20}}'
),

-- TRADE AND TECHNICAL EDUCATION
(
  'WSOS Career and Technical Scholarship',
  'Washington State Opportunity Scholarship',
  '$6,000',
  '2025-10-16',
  'Supporting Washington students pursuing STEM and trade careers. Most recipients are first-generation college students, women, or students of color.',
  ARRAY['Washington state resident', 'STEM or trade program', 'Financial need', 'First-generation preferred'],
  'stem',
  'https://www.waopportunityscholarship.org/students/scholarships/',
  ARRAY['Washington residency proof', 'Program enrollment', 'Financial documentation', 'Career goals statement'],
  ARRAY['washington-state', 'trade', 'technical', 'first-generation', 'diversity'],
  '{"state": "washington", "program_type": ["stem", "trade"], "first_gen_preferred": true, "diversity": true}',
  '{"income_level": {"low": 25, "moderate": 20}, "education_level": {"community-college": 20}, "device_access": {"smartphone-only": 15}}'
);
