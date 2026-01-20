import { useState, useEffect } from "react";
import { GraduationCap, Edit } from "lucide-react";
import CustomSelect from "../Ui/CustomSelect";
import Toast from "../Ui/Toast";

export default function EducationCard({ educationData, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [localEducationData, setLocalEducationData] = useState(educationData || {});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Sync local state when prop changes
  useEffect(() => {
    if (educationData) {
      setLocalEducationData(educationData);
    }
  }, [educationData]);

  const handleSave = async () => {
    setIsEditing(false);
    if (onSave) {
      try {
        await onSave(localEducationData);
        setToastMessage('Education details saved successfully!');
        setToastType('success');
        setShowToast(true);
      } catch (error) {
        setToastMessage('Failed to save education details');
        setToastType('error');
        setShowToast(true);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLocalEducationData(educationData || {});
  };

  return (
    <>
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
      <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          <h3 className="text-foreground">Education</h3>
        </div>
        <button
          onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
          className="text-primary hover:opacity-80 text-sm flex items-center gap-1"
        >
          <Edit className="w-4 h-4" />
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block text-left">Education Level</label>
            <CustomSelect
              value={localEducationData.education_level || ''}
              onChange={(e) => setLocalEducationData({ ...localEducationData, education_level: e.target.value })}
              placeholder="Select education level"
              options={[
                { value: "gcse", label: "GCSE" },
                { value: "a_level", label: "A-Level" },
                { value: "btec", label: "BTEC" },
                { value: "undergraduate", label: "Undergraduate" },
                { value: "postgraduate", label: "Postgraduate" },
                { value: "phd", label: "PhD" },
                { value: "other", label: "Other" }
              ]}
              className="text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block text-left">
              {['gcse', 'a_level', 'btec'].includes(localEducationData.education_level) ? 'School/College' : 'Institution'}
            </label>
            <input
              type="text"
              value={localEducationData.institution_name || ''}
              onChange={(e) => setLocalEducationData({ ...localEducationData, institution_name: e.target.value })}
              placeholder={['gcse', 'a_level', 'btec'].includes(localEducationData.education_level) ? 'e.g. Sixth Form College' : 'e.g. University of London'}
              className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
            />
          </div>

          {/* GCSE/A-Level/BTEC Students - Show Subjects */}
          {['gcse', 'a_level', 'btec'].includes(localEducationData.education_level) ? (
            <>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block text-left">Subject 1 *</label>
                <input
                  type="text"
                  value={localEducationData.subject_one || ''}
                  onChange={(e) => setLocalEducationData({ ...localEducationData, subject_one: e.target.value })}
                  placeholder="e.g. Mathematics"
                  className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block text-left">Subject 2</label>
                <input
                  type="text"
                  value={localEducationData.subject_two || ''}
                  onChange={(e) => setLocalEducationData({ ...localEducationData, subject_two: e.target.value })}
                  placeholder="e.g. Physics"
                  className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block text-left">Subject 3</label>
                <input
                  type="text"
                  value={localEducationData.subject_three || ''}
                  onChange={(e) => setLocalEducationData({ ...localEducationData, subject_three: e.target.value })}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block text-left">Subject 4</label>
                <input
                  type="text"
                  value={localEducationData.subject_four || ''}
                  onChange={(e) => setLocalEducationData({ ...localEducationData, subject_four: e.target.value })}
                  placeholder="e.g. Further Mathematics"
                  className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
                />
              </div>
            </>
          ) : (
            /* University Students - Show Degree Fields */
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block text-left">Year</label>
                  <CustomSelect
                    value={localEducationData.uni_year || ''}
                    onChange={(e) => setLocalEducationData({ ...localEducationData, uni_year: e.target.value })}
                    placeholder="Select year"
                    options={[
                      { value: "foundation", label: "Foundation" },
                      { value: "1st", label: "1st Year" },
                      { value: "2nd", label: "2nd Year" },
                      { value: "3rd", label: "3rd Year" },
                      { value: "4th", label: "4th Year" },
                      { value: "5th", label: "5th Year" },
                      { value: "masters", label: "Masters" },
                      { value: "phd_year_1", label: "PhD Year 1" },
                      { value: "phd_year_2", label: "PhD Year 2" },
                      { value: "phd_year_3", label: "PhD Year 3" },
                      { value: "phd_year_4", label: "PhD Year 4" },
                      { value: "graduated", label: "Graduated" }
                    ]}
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block text-left">Degree</label>
                  <CustomSelect
                    value={localEducationData.degree_type || ''}
                    onChange={(e) => setLocalEducationData({ ...localEducationData, degree_type: e.target.value })}
                    placeholder="Select degree"
                    options={[
                      { value: "ba", label: "BA" },
                      { value: "bsc", label: "BSc" },
                      { value: "beng", label: "BEng" },
                      { value: "llb", label: "LLB" },
                      { value: "bmed", label: "BMed" },
                      { value: "ma", label: "MA" },
                      { value: "msc", label: "MSc" },
                      { value: "meng", label: "MEng" },
                      { value: "mba", label: "MBA" },
                      { value: "llm", label: "LLM" },
                      { value: "phd", label: "PhD" },
                      { value: "other", label: "Other" }
                    ]}
                    className="text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block text-left">Area of Study</label>
                <input
                  type="text"
                  value={localEducationData.area_of_study || ''}
                  onChange={(e) => setLocalEducationData({ ...localEducationData, area_of_study: e.target.value })}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-sm text-muted-foreground mb-1 block text-left">Role Interest 1</label>
            <input
              type="text"
              value={localEducationData.role_interest_option_one || ''}
              onChange={(e) => setLocalEducationData({ ...localEducationData, role_interest_option_one: e.target.value })}
              className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block text-left">Role Interest 2</label>
            <input
              type="text"
              value={localEducationData.role_interest_option_two || ''}
              onChange={(e) => setLocalEducationData({ ...localEducationData, role_interest_option_two: e.target.value })}
              className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block text-left">Society</label>
            <input
              type="text"
              value={localEducationData.society || ''}
              onChange={(e) => setLocalEducationData({ ...localEducationData, society: e.target.value })}
              className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <div className="text-sm text-muted-foreground mb-1 text-left">Education Level</div>
            <div className="text-foreground capitalize text-left">
              {localEducationData.education_level === 'a_level' ? 'A-Level' : localEducationData.education_level === 'btec' ? 'BTEC' : (localEducationData.education_level?.replace(/_/g, ' ') || 'Not specified')}
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1 text-left">
              {['gcse', 'a_level', 'btec'].includes(localEducationData.education_level) ? 'School/College' : 'Institution'}
            </div>
            <div className="text-foreground text-left">{localEducationData.institution_name || 'Not specified'}</div>
          </div>

          {/* GCSE/A-Level/BTEC Students - Show Subjects */}
          {['gcse', 'a_level', 'btec'].includes(localEducationData.education_level) && (
            <div>
              <div className="text-sm text-muted-foreground mb-1 text-left">Subjects</div>
              <div className="text-foreground text-left">
                {localEducationData.subject_one || localEducationData.subject_two || localEducationData.subject_three || localEducationData.subject_four
                  ? [localEducationData.subject_one, localEducationData.subject_two, localEducationData.subject_three, localEducationData.subject_four].filter(Boolean).join(', ')
                  : 'Not specified'}
              </div>
            </div>
          )}

          {/* University Students - Show Degree Fields */}
          {!['gcse', 'a_level', 'btec'].includes(localEducationData.education_level) && localEducationData.education_level && (
            <>
              <div>
                <div className="text-sm text-muted-foreground mb-1 text-left">Year</div>
                <div className="text-foreground text-left capitalize">
                  {localEducationData.uni_year === 'phd_year_1' ? 'PhD Year 1' :
                   localEducationData.uni_year === 'phd_year_2' ? 'PhD Year 2' :
                   localEducationData.uni_year === 'phd_year_3' ? 'PhD Year 3' :
                   localEducationData.uni_year === 'phd_year_4' ? 'PhD Year 4' :
                   localEducationData.uni_year === 'graduated' ? 'Graduated' :
                   localEducationData.uni_year === 'foundation' ? 'Foundation Year' :
                   localEducationData.uni_year === 'placement_year' ? 'Placement Year' :
                   (localEducationData.uni_year || 'Not specified')}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1 text-left">Degree Type</div>
                <div className="text-foreground text-left capitalize">
                  {localEducationData.degree_type === 'bsc' ? 'BSc' :
                   localEducationData.degree_type === 'ba' ? 'BA' :
                   localEducationData.degree_type === 'beng' ? 'BEng' :
                   localEducationData.degree_type === 'msc' ? 'MSc' :
                   localEducationData.degree_type === 'ma' ? 'MA' :
                   localEducationData.degree_type === 'meng' ? 'MEng' :
                   localEducationData.degree_type === 'mphil' ? 'MPhil' :
                   localEducationData.degree_type === 'other' ? 'Other' :
                   (localEducationData.degree_type || 'Not specified')}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1 text-left">Area of Study</div>
                <div className="text-foreground text-left">
                  {localEducationData.area_of_study || 'Not specified'}
                </div>
              </div>
            </>
          )}

          <div>
            <div className="text-sm text-muted-foreground mb-1 text-left">Career Interests</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {localEducationData.role_interest_option_one && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">
                  {localEducationData.role_interest_option_one}
                </span>
              )}
              {localEducationData.role_interest_option_two && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">
                  {localEducationData.role_interest_option_two}
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1 text-left">Society</div>
            <div className="text-foreground text-left">{localEducationData.society || 'Not specified'}</div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
