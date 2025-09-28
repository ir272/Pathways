-- Seed scholarships table with sample data
INSERT INTO scholarships (
  title,
  organization,
  description,
  amount,
  deadline,
  scholarship_type,
  eligibility_criteria,
  target_demographics,
  matching_criteria,
  application_url,
  is_active
) VALUES 
(
  'First Generation College Student Scholarship',
  'Education Foundation',
  'Supporting first-generation college students who demonstrate financial need and academic potential. This scholarship provides both financial assistance and mentorship opportunities to help students succeed in their educational journey.',
  '$5,000',
  '2025-03-15',
  'first-gen',
  ARRAY['First-generation college student', 'Financial need demonstrated', 'Minimum 3.0 GPA', 'Enrolled in accredited institution'],
  '{
    "income_levels": ["low", "moderate"],
    "education_levels": ["high-school", "community-college", "undergraduate"],
    "first_generation": true
  }',
  '{
    "income_level": {"low": 25, "moderate": 20, "middle": 10},
    "education_level": {"high-school": 20, "community-college": 25, "undergraduate": 20},
    "gpa_range": {"3.5-4.0": 15, "3.0-3.4": 10, "2.5-2.9": 5}
  }',
  'https://educationfoundation.org/first-gen-scholarship',
  true
),
(
  'STEM Diversity Scholarship',
  'Tech for All Foundation',
  'Empowering underrepresented students pursuing STEM degrees with financial support and mentorship. Recipients gain access to industry connections, internship opportunities, and ongoing career guidance.',
  '$7,500',
  '2025-04-01',
  'stem',
  ARRAY['STEM major', 'Underrepresented minority', 'Academic excellence', 'Community involvement'],
  '{
    "income_levels": ["low", "moderate", "middle"],
    "education_levels": ["undergraduate", "graduate"],
    "stem_focus": true,
    "diversity_focus": true
  }',
  '{
    "education_level": {"undergraduate": 25, "graduate": 20},
    "gpa_range": {"3.5-4.0": 20, "3.0-3.4": 15},
    "income_level": {"low": 20, "moderate": 15, "middle": 10}
  }',
  'https://techforall.org/stem-diversity',
  true
),
(
  'English Language Learner Achievement Award',
  'Multilingual Education Alliance',
  'Recognizing academic excellence among students for whom English is a second language. This award celebrates the unique perspectives and resilience of multilingual learners.',
  '$3,000',
  '2025-02-28',
  'need-based',
  ARRAY['English as second language', 'Academic achievement', 'Community involvement', 'Leadership potential'],
  '{
    "language_support": ["english-second", "need-translation", "multilingual"],
    "income_levels": ["low", "moderate"],
    "education_levels": ["high-school", "community-college", "undergraduate"]
  }',
  '{
    "language_support": {"english-second": 25, "need-translation": 30, "multilingual": 20},
    "income_level": {"low": 20, "moderate": 15},
    "gpa_range": {"3.5-4.0": 15, "3.0-3.4": 10}
  }',
  'https://multilingualalliance.org/ell-award',
  true
),
(
  'Neurodiversity in Education Scholarship',
  'Learning Differences Foundation',
  'Supporting students with learning differences who have shown resilience and determination in their educational journey. This scholarship recognizes the unique strengths that neurodiverse students bring to academic communities.',
  '$4,000',
  '2025-05-15',
  'need-based',
  ARRAY['Learning differences', 'Self-advocacy skills', 'Academic progress', 'Personal growth'],
  '{
    "learning_needs": ["adhd", "dyslexia", "other"],
    "income_levels": ["low", "moderate", "middle"],
    "education_levels": ["high-school", "community-college", "undergraduate", "graduate"]
  }',
  '{
    "learning_needs": {"adhd": 30, "dyslexia": 30, "other": 25},
    "income_level": {"low": 20, "moderate": 15, "middle": 10},
    "education_level": {"high-school": 15, "community-college": 20, "undergraduate": 20, "graduate": 15}
  }',
  'https://learningdifferences.org/neurodiversity-scholarship',
  true
),
(
  'Rural Student Success Grant',
  'Rural Education Initiative',
  'Helping rural students access higher education opportunities and overcome geographic barriers. This grant includes support for technology access and transportation costs.',
  '$2,500',
  '2025-03-30',
  'need-based',
  ARRAY['Rural location', 'Limited resources', 'College-bound', 'Community involvement'],
  '{
    "income_levels": ["low", "moderate"],
    "device_access": ["smartphone-only", "smartphone-tablet"],
    "internet_access": ["limited", "mobile-only"],
    "education_levels": ["high-school", "community-college"]
  }',
  '{
    "device_access": {"smartphone-only": 25, "smartphone-tablet": 20},
    "internet_access": {"limited": 25, "mobile-only": 20},
    "income_level": {"low": 25, "moderate": 20},
    "education_level": {"high-school": 20, "community-college": 15}
  }',
  'https://ruraleducation.org/success-grant',
  true
),
(
  'Community College Transfer Excellence Award',
  'Transfer Student Alliance',
  'Recognizing outstanding community college students preparing to transfer to four-year institutions. This award supports the unique challenges faced by transfer students.',
  '$3,500',
  '2025-04-15',
  'merit-based',
  ARRAY['Community college student', 'Transfer intent', 'Academic excellence', 'Leadership experience'],
  '{
    "education_levels": ["community-college"],
    "income_levels": ["low", "moderate", "middle"],
    "transfer_focus": true
  }',
  '{
    "education_level": {"community-college": 30},
    "gpa_range": {"3.5-4.0": 25, "3.0-3.4": 20},
    "income_level": {"low": 15, "moderate": 10, "middle": 5}
  }',
  'https://transferalliance.org/excellence-award',
  true
),
(
  'Technology Access Scholarship',
  'Digital Equity Foundation',
  'Providing scholarships and technology resources to students who lack reliable access to digital tools and internet connectivity for their education.',
  '$2,000',
  '2025-06-01',
  'need-based',
  ARRAY['Limited technology access', 'Financial need', 'Academic potential', 'Digital literacy goals'],
  '{
    "device_access": ["smartphone-only", "smartphone-tablet"],
    "internet_access": ["limited", "mobile-only"],
    "income_levels": ["low", "moderate"],
    "education_levels": ["high-school", "community-college", "undergraduate"]
  }',
  '{
    "device_access": {"smartphone-only": 30, "smartphone-tablet": 25},
    "internet_access": {"limited": 30, "mobile-only": 25},
    "income_level": {"low": 25, "moderate": 20}
  }',
  'https://digitalequity.org/tech-scholarship',
  true
),
(
  'Arts and Creativity Scholarship',
  'Creative Minds Foundation',
  'Supporting students pursuing degrees in visual arts, performing arts, creative writing, and other creative disciplines. This scholarship celebrates artistic talent and creative expression.',
  '$4,500',
  '2025-05-01',
  'arts',
  ARRAY['Arts major', 'Portfolio submission', 'Creative achievement', 'Artistic potential'],
  '{
    "education_levels": ["high-school", "undergraduate", "graduate"],
    "income_levels": ["low", "moderate", "middle"],
    "arts_focus": true
  }',
  '{
    "education_level": {"high-school": 20, "undergraduate": 25, "graduate": 20},
    "gpa_range": {"3.5-4.0": 15, "3.0-3.4": 10, "2.5-2.9": 5},
    "income_level": {"low": 20, "moderate": 15, "middle": 10}
  }',
  'https://creativeminds.org/arts-scholarship',
  true
),
(
  'Community Service Leadership Award',
  'Civic Engagement Institute',
  'Recognizing students who have demonstrated exceptional commitment to community service and social impact. This award supports future leaders in nonprofit and public service sectors.',
  '$6,000',
  '2025-03-01',
  'community-service',
  ARRAY['Community service record', 'Leadership experience', 'Social impact focus', 'Academic standing'],
  '{
    "education_levels": ["high-school", "community-college", "undergraduate"],
    "income_levels": ["low", "moderate", "middle"],
    "service_focus": true
  }',
  '{
    "education_level": {"high-school": 20, "community-college": 20, "undergraduate": 25},
    "gpa_range": {"3.5-4.0": 20, "3.0-3.4": 15, "2.5-2.9": 10},
    "income_level": {"low": 15, "moderate": 10, "middle": 5}
  }',
  'https://civicengagement.org/leadership-award',
  true
),
(
  'International Student Excellence Scholarship',
  'Global Education Network',
  'Supporting international students pursuing higher education with both financial assistance and cultural integration support. This scholarship helps bridge cultural and academic transitions.',
  '$8,000',
  '2025-04-30',
  'international',
  ARRAY['International student status', 'Academic excellence', 'Cultural contribution', 'Financial need'],
  '{
    "language_support": ["english-second", "need-translation", "multilingual"],
    "education_levels": ["undergraduate", "graduate"],
    "income_levels": ["low", "moderate"],
    "international_focus": true
  }',
  '{
    "language_support": {"english-second": 25, "need-translation": 30, "multilingual": 20},
    "education_level": {"undergraduate": 25, "graduate": 20},
    "gpa_range": {"3.5-4.0": 20, "3.0-3.4": 15}
  }',
  'https://globaleducation.org/international-scholarship',
  true
);
