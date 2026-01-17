import { useState } from "react";
import { GraduationCap, Edit } from "lucide-react";

export default function EducationCard({ initialData, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [educationData, setEducationData] = useState(initialData);

  const handleSave = () => {
    setIsEditing(false);
    if (onSave) {
      onSave(educationData);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEducationData(initialData);
  };

  return (
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
            <select
              value={educationData.education_level}
              onChange={(e) => setEducationData({ ...educationData, education_level: e.target.value })}
              className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
            >
              <option value="a_level_or_btec">A-Level / BTEC</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
              <option value="phd">PhD</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block text-left">
              {educationData.education_level === 'a_level_or_btec' ? 'School/College' : 'Institution'}
            </label>
            <input
              type="text"
              value={educationData.institution_name || ''}
              onChange={(e) => setEducationData({ ...educationData, institution_name: e.target.value })}
              placeholder={educationData.education_level === 'a_level_or_btec' ? 'e.g. Sixth Form College' : 'e.g. University of London'}
              className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
            />
          </div>

          {/* A-Level/BTEC Students - Show Subjects */}
          {educationData.education_level === 'a_level_or_btec' ? (
            <>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block text-left">Subject 1 *</label>
                <input
                  type="text"
                  value={educationData.subject_one || ''}
                  onChange={(e) => setEducationData({ ...educationData, subject_one: e.target.value })}
                  placeholder="e.g. Mathematics"
                  className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block text-left">Subject 2</label>
                <input
                  type="text"
                  value={educationData.subject_two || ''}
                  onChange={(e) => setEducationData({ ...educationData, subject_two: e.target.value })}
                  placeholder="e.g. Physics"
                  className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block text-left">Subject 3</label>
                <input
                  type="text"
                  value={educationData.subject_three || ''}
                  onChange={(e) => setEducationData({ ...educationData, subject_three: e.target.value })}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block text-left">Subject 4</label>
                <input
                  type="text"
                  value={educationData.subject_four || ''}
                  onChange={(e) => setEducationData({ ...educationData, subject_four: e.target.value })}
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
                  <select
                    value={educationData.uni_year || ''}
                    onChange={(e) => setEducationData({ ...educationData, uni_year: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
                  >
                    <option value="">Select year</option>
                    {educationData.education_level === 'phd' ? (
                      <>
                        <option value="phd_year_1">PhD Year 1</option>
                        <option value="phd_year_2">PhD Year 2</option>
                        <option value="phd_year_3">PhD Year 3</option>
                        <option value="phd_year_4">PhD Year 4</option>
                        <option value="graduated">Graduated</option>
                      </>
                    ) : (
                      <>
                        <option value="foundation">Foundation</option>
                        <option value="1st">1st Year</option>
                        <option value="2nd">2nd Year</option>
                        <option value="3rd">3rd Year</option>
                        <option value="4th">4th Year</option>
                        <option value="5th">5th Year</option>
                        <option value="masters">Masters</option>
                        <option value="graduated">Graduated</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block text-left">Degree</label>
                  <select
                    value={educationData.degree_type || ''}
                    onChange={(e) => setEducationData({ ...educationData, degree_type: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
                  >
                    <option value="">Select degree</option>
                    <option value="ba">BA</option>
                    <option value="bsc">BSc</option>
                    <option value="beng">BEng</option>
                    <option value="llb">LLB</option>
                    <option value="bmed">BMed</option>
                    <option value="ma">MA</option>
                    <option value="msc">MSc</option>
                    <option value="meng">MEng</option>
                    <option value="mba">MBA</option>
                    <option value="llm">LLM</option>
                    <option value="phd">PhD</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block text-left">Area of Study</label>
                <input
                  type="text"
                  value={educationData.area_of_study || ''}
                  onChange={(e) => setEducationData({ ...educationData, area_of_study: e.target.value })}
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
              value={educationData.role_interest_option_one}
              onChange={(e) => setEducationData({ ...educationData, role_interest_option_one: e.target.value })}
              className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block text-left">Role Interest 2</label>
            <input
              type="text"
              value={educationData.role_interest_option_two}
              onChange={(e) => setEducationData({ ...educationData, role_interest_option_two: e.target.value })}
              className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block text-left">Society</label>
            <input
              type="text"
              value={educationData.society}
              onChange={(e) => setEducationData({ ...educationData, society: e.target.value })}
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
              {educationData.education_level === 'a_level_or_btec' ? 'A-Level / BTEC' : educationData.education_level}
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1 text-left">
              {educationData.education_level === 'a_level_or_btec' ? 'School/College' : 'Institution'}
            </div>
            <div className="text-foreground text-left">{educationData.institution_name || 'Not specified'}</div>
          </div>

          {/* A-Level/BTEC Students - Show Subjects */}
          {educationData.education_level === 'a_level_or_btec' ? (
            <div>
              <div className="text-sm text-muted-foreground mb-1 text-left">Subjects</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {educationData.subject_one && (
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">
                    {educationData.subject_one}
                  </span>
                )}
                {educationData.subject_two && (
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">
                    {educationData.subject_two}
                  </span>
                )}
                {educationData.subject_three && (
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">
                    {educationData.subject_three}
                  </span>
                )}
                {educationData.subject_four && (
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">
                    {educationData.subject_four}
                  </span>
                )}
              </div>
            </div>
          ) : (
            /* University Students - Show Degree Fields */
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1 text-left">Year</div>
                  <div className="text-foreground text-left capitalize">
                    {educationData.uni_year?.replace('_', ' ') || 'Not specified'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1 text-left">Degree</div>
                  <div className="text-foreground uppercase text-left">{educationData.degree_type || 'Not specified'}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1 text-left">Area of Study</div>
                <div className="text-foreground text-left">{educationData.area_of_study || 'Not specified'}</div>
              </div>
            </>
          )}

          <div>
            <div className="text-sm text-muted-foreground mb-1 text-left">Career Interests</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">
                {educationData.role_interest_option_one}
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">
                {educationData.role_interest_option_two}
              </span>
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1 text-left">Society</div>
            <div className="text-foreground text-left">{educationData.society}</div>
          </div>
        </div>
      )}
    </div>
  );
}
